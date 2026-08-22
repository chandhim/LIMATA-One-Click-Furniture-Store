# Phase 7B Step 3: Express Gateway Integration (Visual Recommendations)

## Goal
Expose the FastAPI `/visual-recommend` endpoint through the Express AI gateway (`/api/ai/visual-recommend`), following existing Limata architecture patterns to keep the Next.js frontend strictly decoupled from FastAPI.

## Architecture & Implementation

### Request Flow
1. **Frontend (Future)** -> `POST /api/ai/visual-recommend` (multipart/form-data, includes `image` file)
2. **Express Gateway**:
   - Authenticates the user via the existing `authenticate` middleware.
   - Validates the request using `validateFileUpload` (ensuring `image` is present and has a valid MIME type).
   - Defers file processing to `multer` using `memoryStorage` (no disk I/O).
   - Invokes `visualRecommendationController`.
3. **AI Service (`proxyVisualRecommendation`)**:
   - Queries the Prisma database via `getProducts({ includeDetails: true })`.
   - Maps the returned products precisely to the required `ProductMetadata` schema expected by the FastAPI backend (dropping extra fields).
   - Constructs a new `FormData` payload containing:
     - The original `image` Blob
     - The `available_products` serialized as JSON
   - Forwards the request to `POST /visual-recommend` on FastAPI.
4. **FastAPI**: Processes the YOLO inference and RecommendationEngine scoring.
5. **Express Gateway**: Receives the response, wraps it in the standard `sendAiResponse` payload, and returns it to the client.

### Error Handling
- **Missing/Invalid Image**: Rejected immediately by `validateFileUpload` (400 Bad Request).
- **FastAPI Unavailable/Timeout**: Caught by the existing `handleAxiosError` utility and mapped to `503 Service Unavailable` or `504 Gateway Timeout`.
- **FastAPI Validation Errors**: Native HTTP error codes returned by FastAPI are perfectly preserved and forwarded to the frontend with the exact `detail` string provided by Python.

## Testing & Verification
Unit tests were added in `apps/api/src/modules/ai/ai.visual-recommendation.test.ts` using the native Node test runner. The tests mock both Prisma and the Axios AI Client to execute deterministically.

### Test Cases Run:
1. `should retrieve products, construct FormData, and proxy to FastAPI`
   - Verifies the database is queried, FormData is built correctly, and the `visual_context` is successfully propagated back up.
2. `should handle empty catalog safely`
   - Verifies that an empty database returns a graceful response.
3. `should propagate FastAPI errors correctly`
   - Verifies that a 504 Gateway Timeout from the FastAPI client correctly throws an `ApiError`.

### Exact Results
```
▶ Express AI Visual Recommendation Integration
  ✔ should retrieve products, construct FormData, and proxy to FastAPI (2.5881ms)
  ✔ should handle empty catalog safely (0.532ms)
  ✔ should propagate FastAPI errors correctly (0.761ms)
✔ Express AI Visual Recommendation Integration (4.955ms)

ℹ tests 9
ℹ suites 3
ℹ pass 9
ℹ fail 0
```

## Files Changed
1. `apps/api/src/modules/ai/ai.routes.ts`: Registered `POST /api/ai/visual-recommend`.
2. `apps/api/src/modules/ai/ai.controller.ts`: Added `visualRecommendationController`.
3. `apps/api/src/modules/ai/ai.service.ts`: Implemented `proxyVisualRecommendation`.
4. `apps/api/src/modules/ai/ai.visual-recommendation.test.ts`: Created the test suite.

## Deviations & Risks
- **No Deviations**: The implementation adheres perfectly to the Step 3 constraints. The Prisma schema is unmodified.
- **Risks**: Passing the entire catalog in `available_products` for every request works flawlessly for our mock dataset, but may require caching or pagination in a real production environment with thousands of SKUs.

## Status
**READY**: Phase 7B Step 3 is complete. The system is ready for Phase 7B Step 4 (Frontend Integration).
