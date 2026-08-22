import math
from typing import Tuple

from app.ml.bounding_box import BoundingBox

def get_bbox_center(bbox: BoundingBox) -> Tuple[float, float]:
    """
    Computes the geometric center (x, y) of a bounding box.
    
    Args:
        bbox (BoundingBox): The bounding box coordinates.
        
    Returns:
        Tuple[float, float]: The (x, y) coordinates of the center point.
    """
    center_x = (bbox.x1 + bbox.x2) / 2.0
    center_y = (bbox.y1 + bbox.y2) / 2.0
    return center_x, center_y

def get_bottom_center(bbox: BoundingBox) -> Tuple[float, float]:
    """
    Computes the bottom-center (x, y) point of a bounding box.
    This is often used to approximate an object's footprint on the floor.
    
    Args:
        bbox (BoundingBox): The bounding box coordinates.
        
    Returns:
        Tuple[float, float]: The (x, y) coordinates of the bottom-center point.
    """
    center_x = (bbox.x1 + bbox.x2) / 2.0
    bottom_y = bbox.y2
    return center_x, bottom_y

def calculate_pixel_distance(p1: Tuple[float, float], p2: Tuple[float, float]) -> float:
    """
    Calculates the Euclidean distance between two points in pixel space.
    
    Args:
        p1 (Tuple[float, float]): The first point (x, y).
        p2 (Tuple[float, float]): The second point (x, y).
        
    Returns:
        float: The Euclidean distance.
    """
    return math.hypot(p2[0] - p1[0], p2[1] - p1[1])

def calculate_overlap_area(bbox1: BoundingBox, bbox2: BoundingBox) -> float:
    """
    Calculates the intersection area of two bounding boxes.
    
    Args:
        bbox1 (BoundingBox): The first bounding box.
        bbox2 (BoundingBox): The second bounding box.
        
    Returns:
        float: The overlapping area in square pixels.
               Returns 0.0 if there is no overlap.
    """
    inter_x1 = max(bbox1.x1, bbox2.x1)
    inter_y1 = max(bbox1.y1, bbox2.y1)
    inter_x2 = min(bbox1.x2, bbox2.x2)
    inter_y2 = min(bbox1.y2, bbox2.y2)
    
    inter_width = max(0.0, inter_x2 - inter_x1)
    inter_height = max(0.0, inter_y2 - inter_y1)
    
    return inter_width * inter_height
