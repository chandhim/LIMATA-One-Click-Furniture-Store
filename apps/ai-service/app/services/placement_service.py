import cv2
import numpy as np
import logging
from fastapi import UploadFile

from app.ml.ai_orchestrator import AIOrchestrator
from app.ml.placement.result import PlacementEvaluationResult, FurnitureMetadata
from app.core.exceptions import AIServiceException
from app.ml.dependencies import global_loader

logger = logging.getLogger(__name__)

class PlacementService:
    def __init__(self):
        # Instantiate orchestrator with the global loader
        self.orchestrator = AIOrchestrator(loader=global_loader)

    async def evaluate(self, image_file: UploadFile, furniture: FurnitureMetadata) -> PlacementEvaluationResult:
        """
        Decodes the uploaded image and evaluates placement feasibility via the AIOrchestrator.
        """
        try:
            # Read file bytes safely
            image_bytes = await image_file.read()
            if not image_bytes:
                raise ValueError("Uploaded image is empty")

            # Decode image to numpy array using OpenCV
            np_arr = np.frombuffer(image_bytes, np.uint8)
            image_cv2 = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

            if image_cv2 is None:
                raise ValueError("Failed to decode image. Invalid image format.")

            # Run evaluation
            logger.info(f"Evaluating placement for category: {furniture.category}")
            
            # The PlacementEvaluationEngine performs heuristics.
            result = self.orchestrator.evaluate_placement(image_cv2, furniture)
            
            # Since dimensions were normalized (if unavailable), add warning on our side if we detect 1.0x1.0x1.0
            if furniture.width == 1.0 and furniture.depth == 1.0 and furniture.height == 1.0:
                if "DIMENSIONS_UNAVAILABLE" not in result.warnings:
                    result.warnings.append("DIMENSIONS_UNAVAILABLE: Real dimensions were not provided. Using normalized dimensions. Results are heuristic and not metric-accurate.")
                    
            return result

        except Exception as e:
            logger.error(f"Error evaluating placement: {e}")
            raise AIServiceException(f"Placement evaluation failed: {str(e)}") from e
