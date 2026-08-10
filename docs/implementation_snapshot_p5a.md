# Implementation Snapshot: Phase 5A (Recommendation Engine Foundation - Complete)

## 1. Current Integration Points
Phase 5A is fully implemented across both the Python AI Backend and the Express API Gateway. 
- The Express Gateway natively hydrates requests using Prisma via an extended `product.repository.ts`.
- The AI Backend receives unified payloads containing user preferences and the full available catalog.
- The Python engine processes recommendations using purely deterministic scoring rules.

## 2. Express → Prisma → FastAPI Flow
1. The Frontend posts to Express `/api/ai/recommend` with purely `{ "preferences": { ... } }`.
2. The Express `recommendController` validates the payload using `validateRecommendRequest` to ensure `preferences` exist.
3. The Express `ai.service.ts` calls `getProducts({ includeDetails: true })`. This retrieves all products, now intentionally including `description` and `material` fields exclusively for AI mapping.
4. Express strictly maps the Prisma entities into the DTO expected by FastAPI (stripping away relations, timestamps, images, and model URLs).
5. Express bundles the user's `preferences` and `available_products` and proxies to FastAPI `/recommend`.
6. The Python engine executes scoring and returns deterministic matches.
7. Express forwards the AI response back to the client.

## 3. Request / Response Contract
**Express Endpoint Contract (Incoming from Frontend):**
```json
{
  "preferences": {
    "query": "solid wood dining table",
    "max_price": 40000,
    "category": "Dining Room",
    "material": "Wood"
  }
}
```

**FastAPI Contract (Forwarded by Express):**
```json
{
  "preferences": {
    "query": "solid wood dining table",
    ...
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

**FastAPI / Express Final Response:**
```json
{
  "recommended_product_ids": ["cuid123"],
  "matching_info": {
    "cuid123": {
      "score": 100,
      "reasons": ["Material match: Wood"]
    }
  },
  "metadata": {
    "total_evaluated": 1,
    "execution_time_ms": 12.5
  }
}
```

## 4. Product Retrieval & `includeDetails` Behavior
The existing `findProducts` repository function was extended with an internal, service-controlled `includeDetails: boolean` flag. When true, the query explicitly selects `description` and `material` from the database. This maintains the lightweight nature of standard public product lists while satisfying the AI's semantic requirements, entirely avoiding a duplicated Prisma retrieval flow.

## 5. Exact Product Mapping
The `available_products` array sent to FastAPI is rigorously mapped. Only the following fields are forwarded:
- `productId`
- `name`
- `description`
- `category`
- `material`
- `price`
- `stock`

*Excluded:* `images`, `model3dUrl`, `createdAt`, `updatedAt`, and any relation arrays.

## 6. Error Handling
Express handles edge cases robustly:
- **Malformed Preferences:** Throws an immediate `400 Bad Request` if `preferences` is omitted.
- **Empty Catalog:** Validly forwards an empty list to FastAPI, which gracefully returns 0 recommendations.
- **FastAPI Timeout:** Caught as `ECONNABORTED`/`ETIMEDOUT` and mapped to a `504 Gateway Timeout`.
- **Upstream Errors:** Standard HTTP errors from FastAPI (e.g., 422 Validation) have their internal `detail` messages extracted and forwarded to the frontend as `ApiError`.

## 7. Real End-to-End Verification (Step 3)
A full runtime integration test was executed involving a live PostgreSQL database, the Express Gateway (port 4000), and the FastAPI engine (port 8000). 

**Verification Flow Executed:**
1. Verified the Prisma database contained 62 live products.
2. Started the FastAPI backend (`uvicorn app.main:app`) using the Python virtual environment.
3. Started the Express backend (`npm run dev`).
4. Issued authorized JWT requests directly against `http://localhost:4000/api/ai/recommend` with realistic preference payloads.

**Real Test Scenarios & Results:**
- **Normal Query:** `{ "query": "modern sleek bar stool" }` 
  - Result: Correctly fetched catalog, parsed keywords. Top Match: `Bar Stool` (ID: `cmqko6doz0017sn8o438qdkfx`, Score: 40).
- **Category Filter:** `{ "query": "stool", "category": "Dining Room" }` 
  - Result: Returned 6 items restricted precisely to the requested category.
- **Maximum Price Filter:** `{ "query": "stool", "max_price": 15000 }` 
  - Result: Reduced recommendations to only those below the price limit (14 items returned).
- **Material Preference:** `{ "query": "stool", "material": "Wood" }` 
  - Result: Correctly favored wooden items. Top Match received +50 points.
- **No Matching Products:** `{ "max_price": 1 }` 
  - Result: Handled gracefully, returning 0 items.

**Actual API Verification Result:**
The system perfectly maps Express requests through to the DB, forwards the exact strict payload to FastAPI, executes the deterministic algorithm, and surfaces valid JSON matching data back to Express.

## 8. Tests and Actual Results
### Express Tests (`ai.recommendation.test.ts`)
Run natively using Node's test runner `tsx --test`. The Prisma module was mocked to verify logic isolation.
- **Result**: 4/4 Passed (100%).
- Covered: successful proxy mapping and field stripping, empty catalog handling, FastAPI timeout (504), and upstream 422 detail propagation.

### FastAPI Tests (`tests/ml/`)
Run using `pytest`.
- **Result**: 37/37 Passed (100%).
- Covered: Stock filtering, max price filtering, material scoring, keyword extraction deduplication, tie-breaking, empty catalog handling, and existing YOLO/MiDaS integration.

## 8. Explicit Limitations
- The engine operates purely on simple string tokenization. Semantic intent (e.g., matching "couch" with "sofa") is unsupported.
- Plurals and stemming are not handled natively.
- There is no pagination; the engine returns all eligible items.
- Physical dimensions are not modeled in the database, preventing size-based physical constraints during recommendation.

## Phase 5A Readiness
The Phase 5A Recommendation Engine integration is **100% Complete**. The backend is verified and completely prepared for the Phase 5 Frontend UI implementation.
