# AI Subsystem Snapshot

This file contains the current snapshot of the AI subsystem implementation, fully synchronized with the architectural design.

## `app/ml/constants.py`
```python
class ModelNames:
    """
    Centralized constants for all AI model identifiers used across the LIMATA system.
    
    Using these constants instead of magic strings prevents typos and ensures 
    consistent referencing across the registry, loader, and orchestrator.
    """
    YOLO = "yolo"
    MIDAS = "midas"
```

## `app/ml/exceptions.py`
```python
class AIException(Exception):
    """
    Base exception for all AI subsystem errors.
    """
    pass

class ModelLoadException(AIException):
    """
    Raised when an error occurs during the loading of an AI model into memory.
    """
    pass

class AIInferenceException(AIException):
    """
    Raised when an error occurs during model inference.
    """
    pass

class UnsupportedModelException(AIException):
    """
    Raised when an orchestrated model is not supported or not configured correctly.
    """
    pass
```

## `app/ml/bounding_box.py`
```python
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
```

## `app/ml/detected_object.py`
```python
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
```

## `app/ml/detection_result.py`
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
        model_name (str): The identifier of the model used to generate these results.
        inference_time_ms (float): The time taken to run the inference in milliseconds.
    """
    objects: List[DetectedObject] = field(default_factory=list)
    image_width: int = 0
    image_height: int = 0
    model_name: str = "unknown"
    inference_time_ms: float = 0.0
```

## `app/ml/converters.py`
```python
from typing import Any
from .detected_object import DetectedObject
from .detection_result import DetectionResult
from .bounding_box import BoundingBox

def convert_yolo_results(yolo_results: Any, model_name: str, inference_time_ms: float) -> DetectionResult:
    """
    Converts raw Ultralytics YOLO inference results into a decoupled DetectionResult.
    
    This function isolates the messy third-party tensor parsing from the core 
    AI Orchestrator logic.
    
    Args:
        yolo_results (Any): The raw output from a YOLO model() call. It is typically 
                            a list of ultralytics.engine.results.Results objects.
        model_name (str): Identifier of the model that produced these results.
        inference_time_ms (float): Inference duration in milliseconds.
                            
    Returns:
        DetectionResult: A framework-agnostic abstraction containing the detected 
                         objects and image metadata.
    """
    # Assuming a single image was passed for inference, we take the first result object
    if not yolo_results or len(yolo_results) == 0:
        return DetectionResult(model_name=model_name, inference_time_ms=inference_time_ms)
        
    result = yolo_results[0]
    
    # orig_shape is typically (height, width)
    height, width = result.orig_shape if hasattr(result, 'orig_shape') else (0, 0)
    
    detection_result = DetectionResult(
        image_width=width, 
        image_height=height,
        model_name=model_name,
        inference_time_ms=inference_time_ms
    )
    
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
            
            bbox = BoundingBox(x1=xyxy[0], y1=xyxy[1], x2=xyxy[2], y2=xyxy[3])
            
            detected_obj = DetectedObject(
                class_name=class_name,
                confidence=conf,
                bbox=bbox
            )
            detection_result.objects.append(detected_obj)
            
    return detection_result
```

## `app/ml/ai_orchestrator.py`
```python
import time
from typing import Any

from .model_loader import ModelLoader
from .detection_result import DetectionResult
from .converters import convert_yolo_results
from .constants import ModelNames
from .exceptions import AIInferenceException


class AIOrchestrator:
    """
    Coordinates the execution pipeline of AI models for the LIMATA service.
    
    The AIOrchestrator serves as the central conductor for inference requests. 
    It focuses strictly on the execution flowâ€”receiving inputs, routing them to 
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
            image (Any): The input image to be analyzed.
                         
        Returns:
            DetectionResult: A decoupled, framework-agnostic result containing 
                             bounding boxes, confidences, and labels.
                             
        Raises:
            AIInferenceException: If inference fails during execution.
        """
        try:
            start_time = time.perf_counter()
            
            raw_results = self._detect_objects(image, ModelNames.YOLO)
            
            end_time = time.perf_counter()
            inference_time_ms = (end_time - start_time) * 1000.0
            
            return self._convert_results(raw_results, ModelNames.YOLO, inference_time_ms)
            
        except Exception as e:
            raise AIInferenceException(f"Failed to analyze image: {str(e)}") from e

    def _detect_objects(self, image: Any, model_name: str) -> Any:
        """
        Private helper to request the model and execute inference.
        """
        model = self._loader.get_model(model_name)
        return model(image)

    def _convert_results(self, raw_results: Any, model_name: str, inference_time_ms: float) -> DetectionResult:
        """
        Private helper to delegate raw results to the converter.
        """
        return convert_yolo_results(
            raw_results, 
            model_name=model_name, 
            inference_time_ms=inference_time_ms
        )
```

## `app/ml/model_loader.py` (Selected portions)
```python
class ModelState(Enum):
    """
    Enumerates the possible lifecycle states of an AI model in the runtime environment.
    """
    NOT_LOADED = "not_loaded"
    LOADING = "loading"
    READY = "ready"
    FAILED = "failed"

@dataclass
class RuntimeStatus:
    state: ModelState = ModelState.NOT_LOADED
    last_updated: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    error_message: Optional[str] = None
```
 
 # #   P h a s e   2 :   F i r s t   E n d - t o - E n d   Y O L O   V a l i d a t i o n  
  
 # # #   1 .   Y O L O   R e g i s t r a t i o n   D e t a i l s  
 T h e   o f f i c i a l   ` y o l o v 8 n . p t `   m o d e l   w a s   s u c c e s s f u l l y   d o w n l o a d e d   v i a   U l t r a l y t i c s   i n t o   t h e   p r o j e c t ' s   m o d e l s   d i r e c t o r y   a n d   r e g i s t e r e d   u s i n g   ` M o d e l R e g i s t r y ` :  
 -   * * M o d e l   N a m e * * :   Y O L O v 8   N a n o  
 -   * * F r a m e w o r k * * :   U l t r a l y t i c s  
 -   * * W e i g h t s   P a t h * * :   ` m o d e l s / y o l o / y o l o v 8 n . p t `  
 -   * * V e r s i o n * * :   v 8 . 0  
  
 # # #   2 .   R u n t i m e   S t a t e   T r a n s i t i o n s  
 T h e   t e s t   l o g g e d   t h e   e x p e c t e d   t r a n s i t i o n s :  
 ` N O T _ L O A D E D `   â      ` L O A D I N G `   â      ` R E A D Y `  
  
 O n c e   ` R E A D Y ` ,   t h e   l o a d e d   Y O L O   m o d e l   i n s t a n c e   w a s   e f f e c t i v e l y   c a c h e d .   A   s e c o n d a r y   r e q u e s t   d i d   n o t   r e - t r i g g e r   l o a d i n g .  
  
 # # #   3 .   F i r s t   I n f e r e n c e   &   I n t e g r a t i o n   T e s t   R e s u l t s  
 T h e   i n t e g r a t i o n   t e s t   l o a d e d   a n   o f f i c i a l   s a m p l e   i m a g e   ( ` b u s . j p g ` )   a n d   e x e c u t e d   i t   t h r o u g h   t h e   ` A I O r c h e s t r a t o r ` :  
 -   * * I m a g e * * :   ` 6 4 0 x 4 8 0 `  
 -   * * D e t e c t e d   C l a s s e s * * :   4   p e r s o n s ,   1   b u s ,   1   s t o p   s i g n .  
 -   * * I n f e r e n c e   T i m e   T r a c k e d * * :   7 6 . 6 m s   ( 1 s t   r u n ) ,   6 4 . 5 m s   ( c a c h e d   r u n ) .  
 -   * * D e t e c t i o n R e s u l t   G e n e r a t i o n * * :   T h e   ` c o n v e r t e r s . p y `   l o g i c   a c c u r a t e l y   p a r s e d   t h e   r a w   T e n s o r s   i n t o   ` D e t e c t e d O b j e c t ` s ,   c o n t a i n i n g   p r o p e r l y   p o p u l a t e d   ` B o u n d i n g B o x `   c o o r d i n a t e s .  
 -   * * T e s t   S t a t u s * * :   ` P A S S E D `   ( 1   p a s s e d   i n   1 1 . 6 1 s )  
 