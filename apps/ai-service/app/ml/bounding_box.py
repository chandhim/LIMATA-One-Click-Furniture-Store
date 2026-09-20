from dataclasses import dataclass

@dataclass(frozen=True)
class BoundingBox:
    """
    Immutable representation of a 2D bounding box in pixel coordinates.
    
    Attributes:
        x1 (float): Top-left x-coordinate.
        y1 (float): Top-left y-coordinate.
        x2 (float): Bottom-right x-coordinate.
        y2 (float): Bottom-right y-coordinate.
    """
    x1: float
    y1: float
    x2: float
    y2: float
