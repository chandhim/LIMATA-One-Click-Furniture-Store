# LIMATA AI – Phase 4A Implementation Snapshot

## 1. Overview
The implementation of the Phase 4A Spatial Foundation is complete. The image is processed through YOLO and MiDaS, after which their outputs are transformed into a deterministic spatial representation. AI models perform perception, while the SpatialAnalysisEngine performs deterministic reasoning. This ensures that third-party machine learning dependencies and probabilistic tensors are cleanly decoupled from downstream application logic.

## 2. Pipeline Responsibilities

- **YOLO**: Responsible for identifying objects within the image. It outputs probabilistic bounding boxes and confidence scores.
- **MiDaS**: Responsible for estimating relative scene depth. It outputs a probabilistic inverse depth map (disparity map).
- **SpatialAnalysisEngine**: Responsible for deterministic reasoning using the agnostic `DetectionResult` and `DepthResult` DTOs.
- **SpatialAnalysisResult**: Represents the framework-agnostic spatial understanding of the scene.

## 3. Spatial Module Structure
The `app/ml/spatial/` package strictly isolates geometric reasoning:
- `engine.py`: Coordinates the spatial analysis pipeline.
- `distance.py`: Evaluates depth associations and global scene statistics.
- `geometry.py`: Provides pure mathematical operations (e.g., bounding box center, intersection areas).
- `result.py`: Defines the foundational DTOs (`ObjectDistance`, `SpatialAnalysisResult`).

## 4. Coordinate System Specification
All operations within the AI spatial subsystem rigorously adhere to the following coordinate convention:
- **Image Origin**: Top-left corner `(0,0)`.
- **X-axis**: Positive toward the right.
- **Y-axis**: Positive downward.
- **Bounding Box Reference Point**: `(x1, y1)` represents the top-left coordinate, while `(x2, y2)` represents the bottom-right. When approximating the footprint on the floor, the bottom-center point `((x1+x2)/2, y2)` is utilized.
- **Depth Convention**: Depth maps are sourced from MiDaS, which produces *inverse depth* (disparity). A **larger depth scalar value** indicates the object is **closer** to the camera.

## 5. Representative Depth Algorithm
To associate one scalar depth value with each detected object, the following algorithm is executed:
1. Extract the object's `BoundingBox` coordinates.
2. Intersect this box with the `DepthResult` map, sampling all valid depth pixels within the region.
3. Compute the **median** value of these pixels.
4. Store the resulting scalar as `ObjectDistance.estimated_depth`.

**Rationale for Median Selection**: 
The median is robust against noisy predictions and resistant to outliers (e.g., a background object visibly splitting through a bounding box, or bounding box boundary bleed). It provides a significantly more stable metric than the arithmetic mean for depth association in unstructured environments.

## 6. Scene Statistics
The `SpatialAnalysisResult` includes an `analysis_metadata` dictionary that calculates exact global metrics for the image's depth map:
- **`object_count`**: The total number of `DetectedObject`s observed in the scene.
- **`mean_depth`**: The average relative depth of all pixels in the image.
- **`min_depth`**: The minimum pixel depth (representing the furthest background pixel).
- **`max_depth`**: The maximum pixel depth (representing the closest foreground pixel).
- **`variance`**: The statistical variance of the depth map, offering a metric for scene complexity.

## 7. Example DTO Outputs

### `ObjectDistance`
```json
{
  "detected_object": {
    "class_name": "Chair",
    "confidence": 0.93,
    "bbox": {"x1": 150, "y1": 200, "x2": 300, "y2": 450}
  },
  "estimated_depth": 2.15,
  "bbox_center": [225.0, 325.0],
  "confidence": 1.0
}
```

### `SpatialAnalysisResult`
```json
{
  "object_distances": [
    {"class": "Chair", "depth": 2.15},
    {"class": "Table", "depth": 3.40},
    {"class": "TV", "depth": 4.82}
  ],
  "nearest_object": {"class": "TV", "depth": 4.82},
  "furthest_object": {"class": "Chair", "depth": 2.15},
  "analysis_metadata": {
    "object_count": 3.0,
    "mean_depth": 3.46,
    "min_depth": 1.05,
    "max_depth": 5.01,
    "variance": 0.81
  }
}
```
*(Note: Example illustrates inverse depth, where higher values correspond to nearer objects.)*

## 8. Validation Documentation

### Unit Testing
The `test_spatial_unit.py` suite validated the spatial algorithms completely isolated from the AI inference engine.
- ✓ Geometry utilities (center points, Euclidean distances) execute correctly.
- ✓ Depth association appropriately extracts the median pixel array.
- ✓ Ordering logic deterministically sorts by depth scalars.
- ✓ DTO generation remains stable and strictly typed.

### Integration Testing
The `test_spatial_integration.py` suite verified the complete orchestrator pipeline:
`Image` → `YOLO` → `DetectionResult` 
`Image` → `MiDaS` → `DepthResult` 
`DetectionResult + DepthResult` → `SpatialAnalysisEngine` → `SpatialAnalysisResult`

**Verification Criteria Achieved:**
- ✓ `DetectionResult` generated successfully.
- ✓ `DepthResult` generated successfully.
- ✓ Objects were correctly associated with a representative median depth.
- ✓ Deterministic ordering was produced.
- ✓ `SpatialAnalysisResult` was seamlessly created.
- ✓ No framework-specific objects leaked beyond converters into the spatial representation.

**Qualitative Observations:**
When testing the benchmark `bus.jpg` image, the pipeline correctly identified the detected `person` object as having the highest inverse depth value (closest) and the `bus` object as having the lowest (furthest). This serves as an expected qualitative observation and a sanity check, providing evidence that the spatial pipeline behaves consistently with the visual scene.
