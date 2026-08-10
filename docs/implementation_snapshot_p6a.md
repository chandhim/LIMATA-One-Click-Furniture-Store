# Implementation Snapshot: Phase 6A (Placement Feasibility Backend Integration)

## Objective
Expose the existing `PlacementEvaluationEngine` through the Express -> FastAPI architecture so the frontend can request a placement feasibility analysis using a room image and a furniture ID.

## Architecture & Implementation Flow
- **Next.js (Frontend)** -> (multipart/form-data) -> **Express (`/api/ai/placement`)**
- **Express** retrieves the product from Prisma (via `getProductById`), detects missing dimensions (`width`, `height`, `depth`), and generates a `FurnitureMetadata` JSON using a 1.0x1.0x1.0 normalized dimension fallback along with the real category.
- **Express** constructs a new `FormData` stream, proxying the `UploadFile` (image buffer) and `FurnitureMetadata` to FastAPI.
- **FastAPI (`/placement`)** decodes the multipart upload, parses the JSON metadata, and invokes `PlacementService`.
- **PlacementService** uses `AIOrchestrator(loader)` to perform the evaluation, injecting a `DIMENSIONS_UNAVAILABLE` warning before returning the framework-agnostic `PlacementEvaluationResult`.

## Fallback Strategy Details
Because the Prisma `Product` schema currently lacks physical dimensions:
- Products default to 1.0x1.0x1.0.
- A `DIMENSIONS_UNAVAILABLE` warning is embedded inside the result: `"Real dimensions were not provided. Using normalized dimensions. Results are heuristic and not metric-accurate."`
- This ensures the ML engine can run its layout area heuristics without crashing, while explicitly avoiding any claims of real-world metric fit accuracy.

## Test Results
- **FastAPI Pytest:** Passing (659 tests, including valid/missing image/invalid JSON and fallback injection).
- **Express Tests:** Passing (including 404 missing product, form-data construction, fallback dimension generation, and proxy validation).

## Known Limitations
- The returned placement viability relies heavily on YOLO detections and depth mapping heuristics.
- True metric spatial feasibility (e.g., "Will this exact 200cm sofa fit here?") remains impossible until SLAM/ARKit or true calibration is introduced, and dimensions are added to the DB.
