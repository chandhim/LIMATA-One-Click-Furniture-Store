from dataclasses import dataclass
from typing import Any

@dataclass
class DepthResult:
    """
    Represents the complete result of a depth estimation inference.
    
    This acts as a data transfer object (DTO) that cleanly encapsulates 
    the results from the AI service so the rest of the LIMATA backend 
    does not have to parse third-party ML framework structures.
    
    Attributes:
        depth_map (Any): The 2D array representing relative or absolute depth (e.g., numpy ndarray).
        image_width (int): The original width of the processed image in pixels.
        image_height (int): The original height of the processed image in pixels.
        model_name (str): The identifier of the model used to generate these results.
        inference_time_ms (float): The time taken to run the inference in milliseconds.
    """
    depth_map: Any
    image_width: int = 0
    image_height: int = 0
    model_name: str = "midas"
    inference_time_ms: float = 0.0
