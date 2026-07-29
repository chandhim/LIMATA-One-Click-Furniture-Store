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

def convert_midas_results(raw_results: Any, model_name: str, inference_time_ms: float) -> Any:
    """
    Converts raw MiDaS output tensors into a decoupled DepthResult.
    
    Args:
        raw_results (Any): A tuple containing (prediction_tensor, width, height)
        model_name (str): Identifier of the model.
        inference_time_ms (float): Inference duration in milliseconds.
        
    Returns:
        DepthResult: A decoupled result containing the depth map as a numpy array.
    """
    from .depth_result import DepthResult
    
    prediction_tensor, width, height = raw_results
    
    # Convert tensor to numpy array safely
    depth_map = prediction_tensor.cpu().numpy()
    
    return DepthResult(
        depth_map=depth_map,
        image_width=width,
        image_height=height,
        model_name=model_name,
        inference_time_ms=inference_time_ms
    )
