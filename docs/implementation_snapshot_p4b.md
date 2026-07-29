# LIMATA AI – Phase 4B Implementation Snapshot

## 1. Overview
The implementation of the Phase 4B Placement Evaluation Engine is complete. This engine executes strictly deterministic, constraint-based placement evaluations relying solely on the pre-computed `SpatialAnalysisResult` and provided `FurnitureMetadata`. It does not execute ML inferences, reconstruct 3D rooms, or make subjective recommendation rankings. 

## 2. Placement Module Structure
The `app/ml/placement/` package encapsulates all deterministic placement rules:
- `engine.py`: Acts as the facade `PlacementEvaluationEngine`.
- `evaluator.py`: Coordinates the logic combining constraints and orientation testing.
- `constraints.py`: Calculates the `Congestion Index` and evaluates the `Available Placement Region`.
- `geometry.py`: Geometric helper operations for bounding box coverage calculations.
- `result.py`: Defines the DTOs `FurnitureMetadata` and `PlacementEvaluationResult`.

## 3. Assumptions and Limitations
**Assumptions:**
- MiDaS provides relative inverse depth only; hence depth metrics are strictly heuristic ratios, not absolute distances.
- No camera calibration, ground-truth plane detection, SLAM, or 3D floor reconstruction are assumed or performed.
- Furniture dimensions are normalized into heuristic ratios for evaluation.
- All placement decisions are deterministic heuristic judgments, not AI predictions.

**Limitations:**
- Since relative depth does not map 1:1 with metric distance, the "estimated clearance" is an abstract scalar.
- Occlusions limit placement accuracy (what is behind an object is unknown).
- Bounding boxes strictly approximate visible objects and might include empty space.
- The evaluation occurs strictly via 2D image-space reasoning.

## 4. Algorithms and Constraints
- **Available Placement Region**: We infer the region's suitability by observing the distance of the nearest detected obstacle. If the nearest object's inverse depth exceeds twice the mean depth of the scene, we heuristically deem the obstacle as encroaching too heavily into the placement region (`OBSTACLE_PROXIMITY`).
- **Congestion Index**: An algorithm combining:
  1. Base object count weight (5% penalty per object)
  2. Bounding box coverage area vs total pixel area of the image.
  Yields a score (0.0 to 1.0) indicating visual busyness.
- **Orientation Testing**: If the item faces a proximity constraint at 0° but is marked as `rotatable` in its metadata, the engine checks a 90° orientation to verify if constraints are alleviated.

## 5. Complexity Analysis
- **Congestion Calculation**: `O(n)` where `n` is the number of detected objects.
- **Obstacle Comparison**: `O(n)` due to traversal of bounding boxes.
- **Sorting Operations**: `O(n log n)` used inherently during spatial metadata aggregation.
- **Orientation Testing**: `O(k)` where `k` represents orientation candidates (2: 0° and 90°).
Overall, the placement evaluation adds negligible latency (`O(n log n)`) to the overarching AI pipeline.

## 6. Example DTO Outputs

### `FurnitureMetadata`
```json
{
  "width": 150.0,
  "depth": 80.0,
  "height": 100.0,
  "category": "sofa",
  "rotatable": true,
  "optional_clearance_requirements": null
}
```

### `PlacementEvaluationResult`
```json
{
  "suitable": true,
  "evaluation_confidence": 0.73,
  "warnings": [
    "Moderate scene congestion."
  ],
  "limiting_factor": null,
  "estimated_clearance": 625.19,
  "evaluated_orientation": "0°",
  "evaluation_metadata": {
    "congestion_index": 0.548,
    "nearest_obstacle_depth": 625.19
  }
}
```

## 7. Validation Documentation
The implementation was rigorously validated without leaking ML framework objects:
- **Unit Testing**: Mocks tested empty/high congestion scenarios, constraint rejections, and rotatable behavior entirely isolated from the AI inference engine.
- **Integration Testing**: End-to-end evaluation demonstrated that `bus.jpg` (containing 5 objects) yields a `congestion_index` of `~0.55` resulting in a "Moderate scene congestion" warning, yet still deemed suitable for the sample sofa constraints. All tests completed successfully.
