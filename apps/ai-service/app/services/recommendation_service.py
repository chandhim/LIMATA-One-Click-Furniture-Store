import json
import re
import time
import logging
from typing import List, Set, Tuple, Any

from app.models.requests import RecommendationRequest
from app.models.responses import RecommendationResponse
from app.core.gemini_client import GeminiClient

logger = logging.getLogger(__name__)

# ── Stop words for fallback keyword scorer ──────────────────────────────────
_STOP = {
    "i", "a", "an", "the", "to", "for", "of", "in", "on", "at", "by",
    "is", "it", "my", "me", "we", "our", "you", "and", "or", "but",
    "not", "are", "was", "has", "have", "can", "will", "need", "want",
    "get", "some", "very", "just", "please", "help", "furnish", "furnishing",
    "furniture", "room", "rooms", "house", "home", "buy", "find", "looking",
    "good", "best", "like", "would", "any", "all", "new", "item", "items",
    "product", "products", "setup", "setups", "store", "place",
}

ROOM_KEYWORDS = {
    "office": ["office", "study", "desk", "workstation"],
    "bedroom": ["bedroom", "bed", "wardrobe", "nightstand"],
    "dining": ["dining", "dining room", "dinner"],
    "living": ["living", "living room", "sofa", "couch", "lounge"],
    "kitchen": ["kitchen"],
    "outdoor": ["outdoor", "patio", "garden"],
    "nursery": ["baby", "nursery", "kids", "child"],
}

def _tokenize(text: str) -> Set[str]:
    tokens = re.findall(r'[a-z]+', text.lower())
    return {t for t in tokens if t not in _STOP and len(t) > 2}


# ── System instruction for Gemini scorer ─────────────────────────────────────
_SYSTEM = (
    "You are a strict furniture relevance scoring engine for LIMATA, a furniture store. "
    "Your ONLY job is to score how relevant each product is to the user's request. "
    "Be STRICT: products from an unrelated room context or inappropriate function MUST score 0. "
    "Return ONLY a valid JSON array of objects with productId, score, and reason."
)

# ── Prompt template ───────────────────────────────────────────────────────────
def _build_prompt(query: str, constraints: str, products: list) -> str:
    return f"""User query: "{query}"
{constraints}

You are evaluating candidate furniture products for relevance to the user's query.
Score each candidate product on a scale from 0 to 100 based on these STRICT rules:

1. ROOM / CONTEXT ISOLATION:
   - If the user specifies "office" or "work": ONLY office/study furniture (office desks, computer/executive/ergonomic chairs, bookshelves, filing cabinets) can score above 0. NEVER score baby chairs, dining chairs, beds, wardrobes, kitchen items, or lounge sofas above 0.
   - If the user specifies "bedroom": ONLY sleeping/bedroom furniture (beds, mattresses, wardrobes, nightstands, dressers) can score above 0.
   - If the user specifies "dining": ONLY dining tables, dining chairs, sideboards can score above 0.
   - If the user specifies "living room": ONLY living room items (sofas, coffee tables, TV units, lounge armchairs) can score above 0.
   - Any product belonging to an unrelated room MUST score EXACTLY 0.

2. SCORING SCALE:
   - 80-100: Direct, primary match that directly satisfies the user's request.
   - 50-79:  Good, clearly relevant match for the same room context.
   - 40-49:  Acceptable accessory/item for the same room.
   - 0:      Irrelevant, wrong room context, or completely inappropriate.

Candidate Products:
{json.dumps(products, indent=2)}

Return a JSON array containing ONLY items with score >= 40:
[
  {{"productId": "...", "score": 85, "reason": "Short one-sentence explanation of why it fits"}}
]
If no products qualify with score >= 40, return []"""


class RecommendationService:
    def __init__(self):
        self._gemini: GeminiClient | None = None

    def initialize(self):
        try:
            self._gemini = GeminiClient()
        except Exception as e:
            logger.warning(f"GeminiClient initialization deferred: {e}")
            self._gemini = None

    @property
    def gemini(self) -> GeminiClient:
        if not self._gemini:
            self._gemini = GeminiClient()
        return self._gemini

    # ── Fallback keyword scorer (used if Gemini fails) ────────────────────────
    def _keyword_score(self, candidates, prefs) -> list:
        query_raw = (prefs.query or "").lower()
        query_tokens = _tokenize(query_raw)

        # Detect if a specific room was requested in the query
        requested_rooms = []
        for room, synonyms in ROOM_KEYWORDS.items():
            if any(syn in query_raw for syn in synonyms):
                requested_rooms.append(room)

        results = []
        for p in candidates:
            p_cat = p.category.lower()
            p_name = p.name.lower()
            p_desc = (p.description or "").lower()
            combined_text = f"{p_name} {p_cat} {p_desc}"

            # If specific rooms are requested, reject products from conflicting rooms
            if requested_rooms:
                room_match = False
                for r in requested_rooms:
                    room_synonyms = ROOM_KEYWORDS[r]
                    if any(syn in p_cat or syn in p_name for syn in room_synonyms):
                        room_match = True
                        break
                if not room_match:
                    continue  # Incompatible room, score 0

            prod_tokens = _tokenize(combined_text)
            matched = query_tokens & prod_tokens
            if not matched:
                continue

            # Base score of 60 for room match + 15 per matched token (capped at 100)
            score = min(100, 60 + len(matched) * 15)
            if score >= 40:
                results.append({
                    "productId": p.productId,
                    "score": score,
                    "reason": f"Matched criteria: {', '.join(sorted(matched))}",
                })

        results.sort(key=lambda x: -x["score"])
        return results

    def recommend(self, request: RecommendationRequest) -> RecommendationResponse:
        start_time = time.perf_counter()

        prefs    = request.preferences
        products = request.available_products
        total_evaluated = len(products)

        # ── 1. Hard filters (price, stock, explicit category) ─────────────────
        candidates = []
        for p in products:
            if p.stock <= 0:
                continue
            if prefs.max_price is not None and p.price > prefs.max_price:
                continue
            if prefs.category and p.category.lower().strip() != prefs.category.lower().strip():
                continue
            candidates.append(p)

        if not candidates:
            return RecommendationResponse(
                recommended_product_ids=[],
                matching_info={},
                metadata={
                    "total_evaluated": total_evaluated,
                    "execution_time_ms": 0.0,
                },
            )

        # ── 2. Build compact product list for Gemini (trim long descriptions) ─
        product_payload = [
            {
                "productId":   p.productId,
                "name":        p.name,
                "category":    p.category,
                "material":    p.material or "N/A",
                "price":       p.price,
                "description": (p.description or "")[:150].strip(),
            }
            for p in candidates
        ]

        constraints_parts = []
        if prefs.max_price:
            constraints_parts.append(f"Max price: Rs.{prefs.max_price}")
        if prefs.material:
            constraints_parts.append(f"Preferred material: {prefs.material}")
        constraints = " | ".join(constraints_parts) if constraints_parts else ""

        query = prefs.query or "General furniture recommendation"

        # ── 3. Gemini semantic scoring (with keyword fallback) ────────────────
        try:
            prompt = _build_prompt(query, constraints, product_payload)
            raw    = self.gemini.generate_json(_SYSTEM, prompt)
            scored = json.loads(raw)
            if not isinstance(scored, list):
                raise ValueError("Gemini returned non-list JSON")
        except Exception as exc:
            logger.warning(f"[RecommendationService] Gemini scoring failed ({exc}), using keyword fallback.")
            scored = self._keyword_score(candidates, prefs)

        # ── 4. Build response ─────────────────────────────────────────────────
        # STRICT: Keep ONLY items with score >= 40, sort descending
        scored = [s for s in scored if isinstance(s, dict) and s.get("score", 0) >= 40]
        scored.sort(key=lambda x: -x.get("score", 0))

        recommended_ids = []
        matching_info   = {}

        for item in scored:
            pid    = item.get("productId", "")
            score  = int(item.get("score", 0))
            reason = item.get("reason", "")
            if pid:
                recommended_ids.append(pid)
                matching_info[pid] = {
                    "score":   score,
                    "reasons": [reason] if reason else [],
                }

        end_time = time.perf_counter()

        return RecommendationResponse(
            recommended_product_ids=recommended_ids,
            matching_info=matching_info,
            metadata={
                "total_evaluated":   total_evaluated,
                "execution_time_ms": (end_time - start_time) * 1000.0,
            },
        )

    def shutdown(self):
        self._gemini = None
