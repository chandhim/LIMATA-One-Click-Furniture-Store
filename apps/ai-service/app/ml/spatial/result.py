from dataclasses import dataclass, field
from typing import List, Dict, Optional, Tuple

from app.ml.detected_object import DetectedObject

@dataclass
class ObjectDistance:
    """
    Represents an object detection associated with an estimated depth.
    
    This acts as the bridge between Object Detection (2D bounding box) 
    and Depth Estimation (depth map slice).
    
    Attributes:
        detected_object (DetectedObject): The underlying detection.
        estimated_depth (float): A representative depth scalar (e.g. median).
        bbox_center (Tuple[float, float]): The (x, y) center of the bounding box.
        confidence (float): The confidence of the depth association (default 1.0 for now).
    """
    detected_object: DetectedObject
    estimated_depth: float
    bbox_center: Tuple[float, float]
    confidence: float = 1.0

@dataclass
class SpatialAnalysisResult:
    """
    Represents the deterministic spatial understanding of the scene.
    
    It combines DetectionResult and DepthResult into a framework-agnostic 
    geometric foundation.
    
    Attributes:
        object_distances (List[ObjectDistance]): Objects associated with their depths.
        depth_order (List[ObjectDistance]): Objects ordered by depth.
        nearest_object (Optional[ObjectDistance]): The object closest to the camera.
        furthest_object (Optional[ObjectDistance]): The object furthest from the camera.
        analysis_metadata (Dict[str, float]): Scene statistics (e.g., average depth).
    """
    object_distances: List[ObjectDistance] = field(default_factory=list)
    depth_order: List[ObjectDistance] = field(default_factory=list)
    nearest_object: Optional[ObjectDistance] = None
    furthest_object: Optional[ObjectDistance] = None
    analysis_metadata: Dict[str, float] = field(default_factory=dict)
