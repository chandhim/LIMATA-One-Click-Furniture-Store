# Phase 7B Step 2: Visual Context Recommendations (FastAPI Backend)

## Goal
Accept a room image, run existing YOLOv8 detection, deterministically map supported furniture classes to LIMATA recommendation context, and reuse the existing RecommendationService without modifying its core scoring/filtering logic.

## Architecture & Implementation
A new dedicated visual recommendation layer (`VisualRecommendationService`) was created in `apps/ai-service/app/services/visual_recommendation_service.py` to prevent embedding mapping logic throughout the service.

### Request Flow
1. **Endpoint**: `POST /visual-recommend` in `apps/ai-service/app/api/routes/visual_recommendation.py`
2. Accepts `image: UploadFile` and `available_products: str = Form(...)` (JSON string).
3. The image is passed to `AIOrchestrator.analyze_image()` for object detection (using YOLO).
4. The service maps the highest confidence detected object using a deterministic mapping table.
5. A `RecommendationRequest` is dynamically constructed using the mapped category and query.
6. The request is processed by the unmodified `RecommendationService.recommend()`.
7. Returns a `VisualRecommendationResponse` encapsulating the recommended product IDs, scoring metadata, and the newly added `VisualContext`.

### Deterministic Mappings
| Detected YOLO Class | Inferred Context / Category | Injected Recommendation Query |
|--------------------|----------------------------|------------------------------|
| `couch`            | Living Room                | "tv stand table"             |
| `tv`               | Living Room                | "sofa"                       |
| `bed`              | Bedroom                    | "wardrobe"                   |
| `dining table`     | Dining Room                | "chair"                      |

### Edge Case Handling
- **Ignored Classes**: Non-furniture classes (e.g. `person`, `dog`) are ignored.
- **Empty / Unknown Results**: Falls back to an empty visual context and an empty search query, prompting the Recommendation Engine to return the entire eligible catalog as a generic "general" fallback.
- **Confidence Resolution**: If multiple mapped objects exist, the one with the highest confidence score wins.

## Testing & Verification
Unit tests were added in `apps/ai-service/tests/api/test_visual_recommendation.py`.
The suite comprehensively mocks the YOLO output (`AIOrchestrator.analyze_image`) to ensure predictable testing of:
1. `test_visual_recommendation_couch_mapping` (Matches TV stands for a Couch)
2. `test_visual_recommendation_bed_mapping` (Matches Wardrobes for a Bed)
3. `test_visual_recommendation_tv_mapping` (Matches Sofas for a TV)
4. `test_visual_recommendation_dining_table_mapping` (Matches Chairs for a Dining Table)
5. `test_visual_recommendation_ignored_classes` (Correctly falls back to general catalog)
6. `test_visual_recommendation_empty_detection` (Correctly falls back to general catalog)
7. `test_visual_recommendation_highest_confidence_wins` (Resolves multiple objects correctly)

### Test Results
- **Visual Recommendation Suite**: 7/7 tests passed.
- **Full FastAPI Regression Suite**: 47/47 tests passed.

## Deviations & Risks
- **No Deviations**: The implementation adheres strictly to the approved Phase 7B Step 1 audit and preserves the existing architectural layers.
- **Risks**: None. No database modifications or ML model changes were necessary.

## Status
**READY**: The FastAPI visual recommendation backend is complete and verified. The system is ready for Phase 7B Step 3 (Express Proxy & Frontend Integration).
