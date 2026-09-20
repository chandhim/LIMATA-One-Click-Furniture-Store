import sys, re
sys.path.insert(0, 'apps/ai-service')
from app.services.recommendation_service import STOP_WORDS

def _tokenize(text):
    tokens = re.findall(r'[a-z]+', text.lower())
    return {t for t in tokens if t not in STOP_WORDS and len(t) > 2}

# Simulate the catalog categories (read from products, not hard-coded)
catalog_categories = ["Living Room", "Bedroom", "Dining Room", "Office", "Outdoor", "Kitchen"]

def get_preferred(query, catalog_categories):
    raw = query.lower()
    preferred = []
    for cat_name in catalog_categories:
        cat_lower = cat_name.lower()
        cat_words = cat_lower.split()
        if cat_lower in raw or any(len(w) > 2 and w in raw for w in cat_words):
            preferred.append(cat_lower)
    return preferred

test_cases = [
    ("i need to furnish my office", [
        ("baby chair",    "Living Room"),
        ("dining chair",  "Dining Room"),
        ("office desk",   "Office"),
        ("wardrobe",      "Bedroom"),
        ("office chair",  "Office"),
    ]),
    ("bedroom furniture", [
        ("king bed",      "Bedroom"),
        ("dining table",  "Dining Room"),
        ("wardrobe",      "Bedroom"),
        ("office desk",   "Office"),
    ]),
    ("sofa for living room", [
        ("modern sofa",   "Living Room"),
        ("office chair",  "Office"),
        ("dining chair",  "Dining Room"),
    ]),
]

for query, products in test_cases:
    preferred = get_preferred(query, catalog_categories)
    q_tokens = _tokenize(query)
    print(f"\nQuery: '{query}'")
    print(f"  preferred_categories: {preferred}")
    print(f"  query_tokens: {sorted(q_tokens)}")
    for name, cat in products:
        cat_lower = cat.lower()
        passes = (cat_lower in preferred) if preferred else True
        prod_tokens = _tokenize(name + " " + cat)
        matched = q_tokens.intersection(prod_tokens)
        score = len(matched) * 10 + (20 if cat_lower in preferred else 0)
        status = "PASS  " if passes and score > 0 else "REJECT"
        print(f"  [{status}] {name:20s} ({cat:12s}) score={score:3d} matched={matched}")
