from dataclasses import dataclass

from .bounding_box import BoundingBox

@dataclass
class DetectedObject:
    """
    Represents a single object detected by an AI model in an image.
    
    This acts as an abstraction layer so that the rest of the LIMATA 
    application does not depend on the specific format used by 
    Ultralytics YOLO (or any other detection framework).
    
    Attributes:
        class_name (str): The human-readable label of the detected object (e.g., 'chair').
        confidence (float): The model's confidence score for this detection (0.0 to 1.0).
        bbox (BoundingBox): The immutable bounding box coordinates.
    """
    class_name: str
    confidence: float
    bbox: BoundingBox
