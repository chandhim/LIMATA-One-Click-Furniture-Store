import cv2
import numpy as np
import logging
from fastapi import UploadFile
from typing import List, Optional

from app.ml.ai_orchestrator import AIOrchestrator
from app.ml.placement.result import PlacementEvaluationResult, FurnitureMetadata
from app.core.exceptions import AIServiceException
from app.ml.dependencies import global_loader
from app.models.requests import ProductMetadata

logger = logging.getLogger(__name__)

class PlacementService:
    def __init__(self):
        # Instantiate orchestrator with the global loader
        self.orchestrator = AIOrchestrator(loader=global_loader)

    async def evaluate(
        self,
        image_file: UploadFile,
        furniture: FurnitureMetadata,
        available_products: Optional[List[ProductMetadata]] = None,
    ) -> PlacementEvaluationResult:
        """
        Decodes the uploaded image and evaluates placement feasibility via the AIOrchestrator.

        `available_products`, when provided, are same-category candidates the
        orchestrator may recommend as spatially better alternatives if `furniture`
        does not fit (see AIOrchestrator.evaluate_placement / placement/alternatives.py).
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

            # The PlacementEvaluationEngine performs heuristics (congestion, obstacle
            # proximity, dimensional fit, movement space) and, when applicable, ranks
            # spatially suitable alternatives from available_products.
            result = self.orchestrator.evaluate_placement(
                image_cv2, furniture, available_products=available_products
            )

            return result

        except Exception as e:
            logger.error(f"Error evaluating placement: {e}")
            raise AIServiceException(f"Placement evaluation failed: {str(e)}") from e
