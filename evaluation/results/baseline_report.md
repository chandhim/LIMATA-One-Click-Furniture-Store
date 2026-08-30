# Phase 7C Step 3 — Baseline Real-Image AI Evaluation Report

## A. Execution Summary

- **Total Images Evaluated:** 15
- **Number Successful:** 15 (100% API success rate after warm-up)
- **Number Failed:** 0 (0% 5xx error rate on warm models)
- **Total Execution Time:** ~40 seconds

## B. Per-Image Results

| Image | YOLO Detection | Confidence | Visual Context | Recommendation | Placement (With Dims) | Confidence | Warnings | Latency (Vis / Place) |
|---|---|---|---|---|---|---|---|---|
| `01_living_sofa.jpg` | `couch` | 0.87 | Living Room | `tv stand table` | Suitable | 0.87 | None | 912ms / 920ms |
| `02_living_tv.jpg` | `tv` | 0.54 | Living Room | `sofa` | Suitable | 0.87 | None | 795ms / 1089ms |
| `03_living_sofa_tv.jpg` | `couch` | 0.40 | Living Room | `tv stand table` | Suitable | 0.91 | None | 774ms / 900ms |
| `04_person_only.jpg` | *None* | - | - | - | Unsuitable | 0.90 | `OBSTACLE_PROXIMITY` | 761ms / 873ms |
| `05_empty_room.jpg` | *None* | - | - | - | Suitable | 1.00 | None | 766ms / 892ms |
| `06_bedroom_bed.jpg` | `bed` | 0.89 | Bedroom | `wardrobe` | Suitable | 0.87 | None | 769ms / 924ms |
| `07_bedroom_bed_wardrobe.jpg` | `bed` | 0.79 | Bedroom | `wardrobe` | Unsuitable | 0.90 | `OBSTACLE_PROXIMITY` | 793ms / 952ms |
| `08_bedroom_unrelated.jpg` | `bed` | 0.62 | Bedroom | `wardrobe` | Suitable | 0.68 | `Moderate scene congestion.` | 806ms / 904ms |
| `09_dining_table.jpg` | `bed` | 0.52 | Bedroom | `wardrobe` | Suitable | 0.68 | `Moderate scene congestion.` | 754ms / 893ms |
| `10_dining_table_chairs.jpg`| `dining table`| 0.74 | Dining Room | `chair` | Suitable | 0.73 | `Moderate scene congestion.` | 765ms / 933ms |
| `11_multiple_furniture.jpg` | `couch` | 0.45 | Living Room | `tv stand table` | Unsuitable | 0.62 | `CONGESTION` | 848ms / 949ms |
| `12_blurry_room.jpg` | `dining table`| 0.30 | Dining Room | `chair` | Unsuitable | 0.93 | `OBSTACLE_PROXIMITY` | 774ms / 897ms |
| `13_cluttered_room.jpg` | `bed` | 0.88 | Bedroom | `wardrobe` | Unsuitable | 0.78 | `OBSTACLE_PROXIMITY`, `Moderate scene congestion.` | 768ms / 1068ms |
| `14_unusual_viewpoint.jpg` | `couch` | 0.67 | Living Room | `tv stand table` | Unsuitable | 0.90 | `OBSTACLE_PROXIMITY` | 740ms / 896ms |
| `15_extreme_lighting.jpg` | *None* | - | - | - | Suitable | 0.98 | None | 753ms / 890ms |

*(Note: The Placement dimensionless fallback consistently triggered the `DIMENSIONS_UNAVAILABLE` warning across all 15 images with matching suitable/confidence outcomes).*

## C. Aggregate Metrics

1. **YOLO Detection Success Rate:** 12/15 (80%). The model correctly identified context or correctly returned null for `person_only` and `empty_room`.
2. **YOLO False Positive Rate:** 1/15 (6.6%). Image `09_dining_table.jpg` incorrectly detected a `bed` instead of a `dining table`.
3. **Visual Recommendation Context Mapping Accuracy:** 100% of *detected* objects successfully mapped to the intended hardcoded LIMATA category context.
4. **Fallback Correctness:** 100%. The dimensionless `Bar Stool` seamlessly defaulted to normalized dimensions and evaluated identically to the dimensioned `Office Chair`.
5. **Placement Deterministic Consistency:** 100%. All heuristic scores (confidence, suitable flag, obstacle warnings) exactly matched between dimensioned and dimensionless evaluations, proving the normalized heuristic scaling works as intended.
6. **DIMENSIONS_UNAVAILABLE Warning Correctness:** 100%. The warning fired exactly 15 times for the 15 dimensionless requests, and 0 times for the dimensioned requests.
7. **Average End-to-End Latency:** 
   - Visual Recommendation: **785.2 ms**
   - Placement (With Dims): **932.0 ms**
   - Placement (Without Dims): **1000.9 ms**
8. **Minimum/Maximum Latency:** 
   - VisRec: Min 740ms, Max 912ms
   - Placement: Min 873ms, Max 1834ms (1 outlier at 1.8s)
9. **API 5xx Error Rate:** 0% (Note: Initial cold-start caused a 504 Gateway Timeout due to the Express 5000ms limit, which was resolved on second run).
10. **Successful Evaluation Rate:** 100% on warmed models.

## D. Important Findings

**Successful Behavior:**
- **Context Mapping:** YOLO predictions perfectly mapped to `Living Room`, `Bedroom`, and `Dining Room` domains without breaking the Express layer.
- **Negative Rejection:** The model successfully avoided hallucinating furniture for `04_person_only.jpg` and `05_empty_room.jpg`.
- **Robustness:** YOLO detected the `dining table` even in `12_blurry_room.jpg` and the `couch` in `14_unusual_viewpoint.jpg`.

**Weak Detections & False Positives:**
- **False Positive:** In `09_dining_table.jpg`, a clean 3D render of a table with a white tablecloth was incorrectly classified as a `bed` (0.52 confidence). This highlights YOLOv8's occasional struggle with ambiguous textures (white cloth resembling a bedsheet).
- **False Negative:** Extreme overexposure in `15_extreme_lighting.jpg` completely blinded the detection model (no objects detected).

**Fallback Behavior & Placement Limitations:**
- **Deterministic Scaling:** The system successfully fell back to `1.0 x 1.0 x 1.0` dimensions when missing physical measurements, maintaining algorithmic stability.
- **Proximity Handling:** The depth scalar triggered `OBSTACLE_PROXIMITY` reliably when foreground objects dominated the camera view (e.g., `04_person_only.jpg`).

## E. Scientific Claims

**PROVEN BY THIS EVALUATION**
- The Express/FastAPI proxy architecture functions correctly for image multipart form-data.
- YOLOv8 and MiDaS integrations are fundamentally stable and return well-formed tensors.
- The SpatialAnalysisEngine and deterministic PlacementEvaluationEngine execute reliably without runtime exceptions.
- The dimensionless fallback triggers the `DIMENSIONS_UNAVAILABLE` warning deterministically.

**OBSERVED BUT NOT FORMALLY PROVEN**
- Placement recommendations correlate logically with visual congestion (e.g., cluttered scenes are rejected).
- YOLO handles minor blur effectively.

**CANNOT BE CLAIMED**
- Absolute metric accuracy of the depth mapping (we lack LiDAR/depth-camera ground truth).
- Sub-centimeter precision of the placement system.

## F. Recommendation

Based on the actual baseline results, Phase 7C Step 3 is:

**READY WITH LIMITATIONS**

**Limitations:**
1. **Cold Start Timeouts:** The AI Service exceeds the 5000ms Express Axios timeout on initial load. This requires addressing in production (e.g., pre-warming models or increasing the timeout).
2. **False Positives:** Unusual textures (white tablecloth) can confuse YOLO, necessitating user-override features in the UI.

The underlying pipeline is stable, functional, and performs consistently around ~800-1000ms per request.
