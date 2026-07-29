import numpy as np
from typing import List, Dict, Optional
from app.ml.detection_result import DetectionResult
from app.ml.depth_result import DepthResult
from app.ml.detected_object import DetectedObject

from .result import ObjectDistance
from .geometry import get_bbox_center

def associate_depth(detected_object: DetectedObject, depth_map: np.ndarray) -> ObjectDistance:
    """
    Associates a DetectedObject with a representative depth scalar from the depth map.
    
    Uses the median depth of the pixels inside the object's bounding box.
    Median is robust to outliers such as noise or minor bounding box inaccuracies.
    
    Args:
        detected_object (DetectedObject): The object to evaluate.
        depth_map (np.ndarray): The 2D depth map (H, W).
        
    Returns:
        ObjectDistance: The populated DTO.
    """
    bbox = detected_object.bbox
    
    # Constrain bounding box to image dimensions
    height, width = depth_map.shape
    x1 = max(0, int(bbox.x1))
    y1 = max(0, int(bbox.y1))
    x2 = min(width, int(bbox.x2))
    y2 = min(height, int(bbox.y2))
    
    # Extract depth values within the bounding box
    region = depth_map[y1:y2, x1:x2]
    
    if region.size == 0:
        # Fallback if bounding box is completely outside or invalid
        median_depth = 0.0
    else:
        median_depth = float(np.median(region))
        
    center = get_bbox_center(bbox)
    
    return ObjectDistance(
        detected_object=detected_object,
        estimated_depth=median_depth,
        bbox_center=center,
        confidence=1.0
    )

def sort_by_depth(objects: List[ObjectDistance]) -> List[ObjectDistance]:
    """
    Sorts the objects by depth.
    
    Note: In MiDaS, larger values indicate closer proximity (disparity).
    We sort descending so the nearest object is first.
    
    Args:
        objects (List[ObjectDistance]): The list to sort.
        
    Returns:
        List[ObjectDistance]: Sorted list (closest first).
    """
    return sorted(objects, key=lambda obj: obj.estimated_depth, reverse=True)

def calculate_scene_statistics(depth_map: np.ndarray, object_count: int) -> Dict[str, float]:
    """
    Calculates basic statistical properties of the scene based on the depth map.
    
    Args:
        depth_map (np.ndarray): The 2D depth map.
        object_count (int): The number of detected objects.
        
    Returns:
        Dict[str, float]: A dictionary containing statistical metrics.
    """
    if depth_map.size == 0:
        return {
            "object_count": float(object_count),
            "mean_depth": 0.0,
            "min_depth": 0.0,
            "max_depth": 0.0,
            "variance": 0.0
        }
        
    return {
        "object_count": float(object_count),
        "mean_depth": float(np.mean(depth_map)),
        "min_depth": float(np.min(depth_map)),
        "max_depth": float(np.max(depth_map)),
        "variance": float(np.var(depth_map))
    }
