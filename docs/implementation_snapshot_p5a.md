# Implementation Snapshot: Phase 5A (Recommendation Engine Foundation)

## 1. Current Integration Points
The AI service exposes a placeholder recommendation endpoint via FastAPI (`app/api/routes/recommendation.py`), which maps to `RecommendationService`. Currently, the service raises a `NotImplementedException`.
The Express gateway in `ai.service.ts` proxies requests from the frontend to this FastAPI endpoint via `proxyRecommend`.

## 2. Proposed Recommendation Data Flow
Because the Python AI service must remain decoupled from Prisma and the primary database, the data flow must be orchestrated by the Express gateway:
1. **Frontend Request**: User sends a recommendation request (e.g., search text, budget, preferred category) to the Express Gateway `/api/ai/recommend`.
2. **Catalog Fetch**: The Express Gateway uses the existing `product.repository.ts` to fetch the current available product catalog (or a pre-filtered subset).
3. **AI Proxy**: The Express Gateway bundles the user's preferences AND the `available_products` metadata into a single JSON payload and forwards it to the FastAPI `/recommend` endpoint.
4. **AI Processing**: The FastAPI `RecommendationService` applies a deterministic scoring/filtering algorithm against the provided product metadata and returns the ranked results with reasoning.
5. **Response**: Express forwards the AI response back to the frontend.

## 3. Request / Response Contract
The current `requests.py` and `responses.py` are insufficient and must be updated to be framework-independent and context-rich.

**Updated RecommendationRequest (FastAPI):**
```json
{
  "preferences": {
    "query": "solid wood dining table",
    "max_price": 40000,
    "category": "Dining Room",
    "material": "Wood"
  },
  "available_products": [
    {
      "productId": "cuid123",
      "name": "Dining Table",
      "description": "Solid wood dining table.",
      "category": "Dining Room",
      "material": "Wood",
      "price": 30000.0,
      "stock": 5
    }
  ]
}
```

**Updated RecommendationResponse (FastAPI):**
```json
{
  "recommended_product_ids": ["cuid123"],
  "matching_info": {
    "cuid123": {
      "score": 100,
      "reasons": ["Matches material: Wood", "Under budget: 30000.0 <= 40000", "Matches category: Dining Room"]
    }
  },
  "metadata": {
    "total_evaluated": 1,
    "execution_time_ms": 12.5
  }
}
```

## 4. Product Fields Used
- `productId` (Identifier)
- `name`, `description` (Textual/Semantic matching)
- `category` (Hard constraint)
- `material` (Soft/Hard constraint depending on user preference)
- `price` (Budget constraint)
- `stock` (Availability constraint - out of stock items are filtered)

## 5. Scoring / Matching Approach
Phase 5A will implement a **Deterministic Rule & Scoring Engine** using only standard Python logic (no LLMs, no embeddings):
1. **Hard Filters**: Eliminate products where `stock == 0`, or `price > max_price` (if provided), or `category != requested_category` (if strict).
2. **Soft Scoring**: 
   - Assign points if `material` matches.
   - Assign points for keyword matches from the user's `query` found in the product `name` or `description` (case-insensitive substring/token matching).
3. **Ranking**: Sort products by descending score.
This approach establishes the structural foundation (data ingestion, processing, response formatting) while leaving the engine completely extensible. When Phase 5B introduces LLMs or embeddings, only the internal scoring function needs to change.

## 6. Explicit Limitations
- **No Spatial Awareness**: The recommendation engine knows nothing about the user's room.
- **No Dimensional Constraints**: Prisma lacks dimension fields (length, width, height), so the engine cannot recommend items based on "will it fit?". Dummy data will not be invented.
- **Basic NLP**: Keyword matching handles plurals and synonyms poorly compared to embedding-based semantic search.

## 7. Relationship to Spatial Analysis (4A) and Placement Evaluation (4B)
The Recommendation Engine is entirely separate from Phases 4A and 4B. 
- **Recommendation** operates purely on tabular/textual product metadata to find *what* the user wants.
- **Spatial Analysis & Placement** operate purely on visual/geometric data to determine if a specific item *fits* in a specific space.
In the future, they may be chained together sequentially, but their architectures share no internal state.

## 8. Files Requiring Modification
During implementation, the following files will be modified:
- `apps/ai-service/app/models/requests.py` (Update `RecommendationRequest`)
- `apps/ai-service/app/models/responses.py` (Update `RecommendationResponse`)
- `apps/ai-service/app/services/recommendation_service.py` (Implement scoring logic)
- `apps/api/src/modules/ai/ai.service.ts` (Update `proxyRecommend` to fetch and inject product data)
- (Potentially) `apps/ai-service/app/api/routes/recommendation.py` if request models shift significantly.

## 9. Testing Strategy
- **Unit Tests (`tests/ml/test_recommendation.py`)**: Create a suite passing a fixed list of mock dictionary products to the `RecommendationService`. Test hard filters (price, stock) and soft scoring (keywords).
- **Integration Tests (Express)**: Verify the Express gateway correctly bundles the Prisma output before sending it to FastAPI.

## 10. Recommended Next Implementation Step
1. Update the DTOs (`requests.py`, `responses.py`) in the Python AI Service.
2. Implement the deterministic scoring logic in `recommendation_service.py` and write unit tests for it.
3. Update the Express gateway `ai.service.ts` to hydrate the payload with the Prisma catalog.

## Architectural Readiness Conclusion
The architecture is **READY** for Phase 5A implementation. The decoupled nature of the Express API and FastAPI makes it trivial to pass state safely. There are no architectural blockers, missing dependencies, or inconsistencies preventing this implementation.
