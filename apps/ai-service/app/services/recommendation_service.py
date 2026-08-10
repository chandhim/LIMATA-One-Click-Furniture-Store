from app.core.exceptions import NotImplementedException
from app.models.requests import RecommendationRequest
from app.models.responses import RecommendationResponse


import time
import re
from typing import Dict, List, Set, Tuple, Any

class RecommendationService:
    def __init__(self):
        pass

    def initialize(self):
        pass

    def recommend(self, request: RecommendationRequest) -> RecommendationResponse:
        start_time = time.perf_counter()
        
        prefs = request.preferences
        products = request.available_products
        
        total_evaluated = len(products)
        
        # Helper for tokenization
        def _tokenize(text: str) -> Set[str]:
            if not text:
                return set()
            # Normalize to lowercase and extract alphabetic tokens
            tokens = re.findall(r'[a-z]+', text.lower())
            return set(tokens)
            
        query_tokens = _tokenize(prefs.query) if prefs.query else set()
        req_category = prefs.category.lower().strip() if prefs.category else None
        req_material = prefs.material.lower().strip() if prefs.material else None
        req_max_price = prefs.max_price
        
        eligible_products: List[Tuple[Any, int, List[str]]] = []
        
        for prod in products:
            # Hard Filters
            if prod.stock <= 0:
                continue
            if req_max_price is not None and prod.price > req_max_price:
                continue
            if req_category is not None and prod.category.lower().strip() != req_category:
                continue
                
            # Soft Scoring
            score = 0
            reasons = []
            
            # Material Match
            if req_material and prod.material:
                if req_material in prod.material.lower():
                    score += 50
                    reasons.append(f"Material match: {prod.material}")
                    
            # Query Keyword Match
            if query_tokens:
                prod_text = f"{prod.name} {prod.description}"
                prod_tokens = _tokenize(prod_text)
                
                matched_tokens = query_tokens.intersection(prod_tokens)
                if matched_tokens:
                    points = len(matched_tokens) * 10
                    score += points
                    reasons.append(f"Keyword match ({len(matched_tokens)} tokens, +{points} pts)")
                    
            if score == 0:
                reasons.append("Eligible product (Score: 0)")
                
            eligible_products.append((prod, score, reasons))
            
        # Ranking: Descending score, then tie-break by productId alphabetically
        eligible_products.sort(key=lambda x: (-x[1], x[0].productId))
        
        recommended_ids = []
        matching_info = {}
        
        for prod, score, reasons in eligible_products:
            recommended_ids.append(prod.productId)
            # Create a localized dict payload for the DTO
            matching_info[prod.productId] = {
                "score": score,
                "reasons": reasons
            }
            
        end_time = time.perf_counter()
        exec_time_ms = (end_time - start_time) * 1000.0
        
        return RecommendationResponse(
            recommended_product_ids=recommended_ids,
            matching_info=matching_info,
            metadata={
                "total_evaluated": total_evaluated,
                "execution_time_ms": exec_time_ms
            }
        )

    def shutdown(self):
        pass
