# AI Orchestrator & Detection Abstraction Files

Here are the 4 requested files that make up the decoupled detection pipeline for the LIMATA service.

## `detected_object.py`
```python
from dataclasses import dataclass
from typing import Tuple

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
        bbox (Tuple[float, float, float, float]): The bounding box coordinates in the 
                                                  format (x1, y1, x2, y2).
    """
    class_name: str
    confidence: float
    bbox: Tuple[float, float, float, float]
```

## `detection_result.py`
```python
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
    """
    objects: List[DetectedObject] = field(default_factory=list)
    image_width: int = 0
    image_height: int = 0
```

## `converters.py`
```python
from typing import Any
from .detected_object import DetectedObject
from .detection_result import DetectionResult

def convert_yolo_results(yolo_results: Any) -> DetectionResult:
    """
    Converts raw Ultralytics YOLO inference results into a decoupled DetectionResult.
    
    This function isolates the messy third-party tensor parsing from the core 
    AI Orchestrator logic.
    
    Args:
        yolo_results (Any): The raw output from a YOLO model() call. It is typically 
                            a list of ultralytics.engine.results.Results objects.
                            
    Returns:
        DetectionResult: A framework-agnostic abstraction containing the detected 
                         objects and image metadata.
    """
    # Assuming a single image was passed for inference, we take the first result object
    if not yolo_results or len(yolo_results) == 0:
        return DetectionResult()
        
    result = yolo_results[0]
    
    # orig_shape is typically (height, width)
    height, width = result.orig_shape if hasattr(result, 'orig_shape') else (0, 0)
    
    detection_result = DetectionResult(image_width=width, image_height=height)
    
    # Safely iterate over bounding boxes if they exist
    if hasattr(result, 'boxes') and result.boxes is not None:
        boxes = result.boxes
        # result.names contains the mapping of class indices to string labels
        names_dict = result.names if hasattr(result, 'names') else {}
        
        for i in range(len(boxes)):
            box = boxes[i]
            
            # Extract box coordinates (x1, y1, x2, y2)
            xyxy = box.xyxy[0].tolist()
            # Extract confidence score
            conf = float(box.conf[0])
            # Extract class index and name
            cls_idx = int(box.cls[0])
            class_name = names_dict.get(cls_idx, f"class_{cls_idx}")
            
            detected_obj = DetectedObject(
                class_name=class_name,
                confidence=conf,
                bbox=(xyxy[0], xyxy[1], xyxy[2], xyxy[3])
            )
            detection_result.objects.append(detected_obj)
            
    return detection_result
```

## `ai_orchestrator.py`
```python
from typing import Any

from .model_loader import ModelLoader
from .detection_result import DetectionResult
from .converters import convert_yolo_results


class AIOrchestrator:
    """
    Coordinates the execution pipeline of AI models for the LIMATA service.
    
    The AIOrchestrator serves as the central conductor for inference requests. 
    It focuses strictly on the execution flow—receiving inputs, routing them to 
    the correct models via the ModelLoader, and returning the outputs. It is 
    completely decoupled from model initialization, lifecycle management, and metadata.
    """

    def __init__(self, loader: ModelLoader) -> None:
        """
        Initializes the AIOrchestrator with a required ModelLoader dependency.
        
        Args:
            loader (ModelLoader): The loader service responsible for supplying 
                                  fully initialized AI models on demand.
        """
        self._loader: ModelLoader = loader

    def analyze_image(self, image: Any) -> DetectionResult:
        """
        Executes object detection on the provided image using a YOLO model.
        
        This method retrieves the appropriate YOLO model from the loader, 
        passes the input image for inference, and cleanly converts the raw 
        third-party tensors into a LIMATA-native DetectionResult.
        
        Args:
            image (Any): The input image to be analyzed. The type is flexible 
                         (e.g., numpy array, PIL Image) depending on what the 
                         underlying YOLO implementation expects.
                         
        Returns:
            DetectionResult: A decoupled, framework-agnostic result containing 
                             bounding boxes, confidences, and labels.
        """
        # Retrieve the model lazily through the loader.
        model = self._loader.get_model("yolo")
        
        # Execute the object detection inference
        raw_results = model(image)
        
        # Convert raw YOLO results to a decoupled DetectionResult abstraction
        return convert_yolo_results(raw_results)
```
