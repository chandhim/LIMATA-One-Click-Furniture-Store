import time
from typing import Any

from .model_loader import ModelLoader
from .detection_result import DetectionResult
from .depth_result import DepthResult
from app.ml.spatial.result import SpatialAnalysisResult
from app.ml.spatial.engine import SpatialAnalysisEngine
from app.ml.placement.result import FurnitureMetadata, PlacementEvaluationResult
from app.ml.placement.engine import PlacementEvaluationEngine
from .converters import convert_yolo_results, convert_midas_results
from .constants import ModelNames
from .exceptions import AIInferenceException


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
        self._spatial_engine: SpatialAnalysisEngine = SpatialAnalysisEngine()
        self._placement_engine: PlacementEvaluationEngine = PlacementEvaluationEngine()

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

    def estimate_depth(self, image: Any) -> Any:
        """
        Executes depth estimation on the provided image using a MiDaS model.
        
        Args:
            image (Any): The input image (numpy array format expected by MiDaS).
                         
        Returns:
            DepthResult: A decoupled, framework-agnostic result containing 
                         the estimated depth map.
                         
        Raises:
            AIInferenceException: If inference fails during execution.
        """
        try:
            start_time = time.perf_counter()
            
            raw_results = self._estimate_depth(image, ModelNames.MIDAS)
            
            end_time = time.perf_counter()
            inference_time_ms = (end_time - start_time) * 1000.0
            
            return self._convert_depth_results(raw_results, ModelNames.MIDAS, inference_time_ms)
            
        except Exception as e:
            raise AIInferenceException(f"Failed to estimate depth: {str(e)}") from e

    def analyze_spatial_layout(self, image: Any) -> SpatialAnalysisResult:
        """
        Executes both object detection and depth estimation pipelines, then 
        combines them into a deterministic spatial foundation.
        
        Args:
            image (Any): The input image to analyze.
            
        Returns:
            SpatialAnalysisResult: The combined spatial representation.
            
        Raises:
            AIInferenceException: If any pipeline fails.
        """
        try:
            # 1. Object Detection (YOLO)
            detection_result = self.analyze_image(image)
            
            # 2. Depth Estimation (MiDaS)
            depth_result = self.estimate_depth(image)
            
            # 3. Spatial Analysis (Deterministic)
            return self._spatial_engine.analyze(detection_result, depth_result)
            
        except Exception as e:
            raise AIInferenceException(f"Failed to analyze spatial layout: {str(e)}") from e

    def evaluate_placement(self, image: Any, furniture: FurnitureMetadata) -> PlacementEvaluationResult:
        """
        Convenience method that runs the entire spatial layout pipeline and then evaluates
        whether the provided furniture constraints are suitable for the room.
        
        Args:
            image (Any): The input image to analyze.
            furniture (FurnitureMetadata): Constraints of the furniture item.
            
        Returns:
            PlacementEvaluationResult: The deterministic evaluation output.
        """
        try:
            # 1. Analyze spatial layout (perceive the room)
            spatial_result = self.analyze_spatial_layout(image)
            
            # 2. Heuristically evaluate placement against the spatial layout
            # Here we need image height and width to get total area.
            # DetectionResult stores it, but we can also retrieve it directly from the image shape.
            # Since analyze_spatial_layout abstracts the original image, we'll extract shape here.
            # Assuming OpenCV format image (H, W, C)
            try:
                import numpy as np
                if isinstance(image, np.ndarray):
                    image_height, image_width = image.shape[:2]
                else:
                    image_height, image_width = 480, 640 # fallback
            except:
                image_height, image_width = 480, 640 # fallback
                
            return self._placement_engine.evaluate(spatial_result, furniture, image_width, image_height)
        except Exception as e:
            raise AIInferenceException(f"Failed to evaluate placement: {str(e)}") from e

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

    def _estimate_depth(self, image: Any, model_name: str) -> Any:
        """
        Private helper to request the MiDaS model and execute inference.
        """
        import torch
        model = self._loader.get_model(model_name)
        
        # Determine device (CPU for now as safe default)
        device = torch.device("cpu")
        model.to(device)
        
        # Apply transform
        input_batch = model.transform(image).to(device)
        
        with torch.no_grad():
            prediction = model(input_batch)
            
            # Interpolate to original size
            # image is expected to be a numpy array of shape (H, W, C)
            height, width = image.shape[:2]
            prediction = torch.nn.functional.interpolate(
                prediction.unsqueeze(1),
                size=(height, width),
                mode="bicubic",
                align_corners=False,
            ).squeeze()
            
        # We return the tensor, which converters.py will wrap in a DepthResult
        return (prediction, width, height)

    def _convert_depth_results(self, raw_results: Any, model_name: str, inference_time_ms: float) -> Any:
        """
        Private helper to delegate raw depth results to the converter.
        """
        from .converters import convert_midas_results
        return convert_midas_results(
            raw_results, 
            model_name=model_name, 
            inference_time_ms=inference_time_ms
        )
