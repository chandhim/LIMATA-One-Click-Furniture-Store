from typing import Dict, Any, Tuple
from app.ml.spatial.result import SpatialAnalysisResult
from app.ml.placement.geometry import calculate_bbox_area

def calculate_congestion_index(spatial_result: SpatialAnalysisResult, image_width: int, image_height: int) -> float:
    """
    Calculates a deterministic heuristic representing scene congestion.
    
    Formula combines:
    - Base weight per object detected.
    - Total percentage of image pixel area covered by bounding boxes.
    - (Future/Optional) Depth distribution.
    
    Returns a score typically between 0.0 (empty) and 1.0 (highly congested).
    """
    total_area = float(image_width * image_height)
    if total_area == 0:
        return 0.0
        
    object_count = len(spatial_result.object_distances)
    
    # 1. Base object weight (e.g., 0.05 per object)
    count_congestion = min(1.0, object_count * 0.05)
    
    # 2. Bounding box coverage
    covered_area = 0.0
    for obj in spatial_result.object_distances:
        covered_area += calculate_bbox_area(obj.detected_object.bbox)
        
    coverage_ratio = min(1.0, covered_area / total_area)
    
    # Simple weighted average
    congestion_index = (count_congestion * 0.4) + (coverage_ratio * 0.6)
    
    return min(1.0, congestion_index)


def evaluate_placement_region(spatial_result: SpatialAnalysisResult) -> Tuple[bool, float]:
    """
    Infers whether the Available Placement Region is reasonably clear.
    
    Uses deterministic constraints:
    - Relies on nearest object inverse depth (high value = close).
    - Ensures the nearest object is not overwhelmingly close.
    
    Returns:
        (is_region_clear, nearest_obstacle_depth)
    """
    if not spatial_result.nearest_object:
        # No objects detected -> region is clear
        return True, 0.0
        
    nearest_depth = spatial_result.nearest_object.estimated_depth
    
    # Heuristic: Since MiDaS outputs are inverse depths, higher = closer.
    # We compare the nearest depth to the average scene depth.
    # If the nearest object is significantly closer than the mean, we flag the region as constrained.
    # Note: These values are relative, not absolute metric units.
    
    mean_depth = spatial_result.analysis_metadata.get("mean_depth", 0.0)
    
    # If the closest object is more than 2x the mean inverse depth, it's very close to the camera.
    if mean_depth > 0 and nearest_depth > (mean_depth * 2.0):
        return False, nearest_depth
        
    return True, nearest_depth
