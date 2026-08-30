from dataclasses import dataclass, field
from typing import List

from .detected_object import DetectedObject

@dataclass
class DetectionResult:
    """
    Represents the complete result of an object detection inference.
    
    This acts as a data transfer object (DTO) that safely encapsulates 
    the results from the AI service so the rest of the LIMATA backend 
    does not have to parse third-party ML framework structures.
    
    Attributes:
        objects (List[DetectedObject]): The list of individual objects found in the image.
        image_width (int): The original width of the processed image in pixels.
        image_height (int): The original height of the processed image in pixels.
        model_name (str): The identifier of the model used to generate these results.
        inference_time_ms (float): The time taken to run the inference in milliseconds.
    """
    objects: List[DetectedObject] = field(default_factory=list)
    image_width: int = 0
    image_height: int = 0
    model_name: str = "unknown"
    inference_time_ms: float = 0.0
