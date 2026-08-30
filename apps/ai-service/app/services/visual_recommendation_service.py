import cv2
import numpy as np
import logging
from fastapi import UploadFile
from typing import List

from app.ml.registry import registry
from app.ml.model_loader import ModelLoader
from app.ml.ai_orchestrator import AIOrchestrator
from app.services.recommendation_service import RecommendationService
from app.ml.placement.constraints import calculate_congestion_index, evaluate_placement_region
from app.models.requests import ProductMetadata, RecommendationRequest, RecommendationPreferences
from app.models.responses import VisualRecommendationResponse, VisualContext
from app.core.exceptions import AIServiceException

logger = logging.getLogger(__name__)

global_loader = ModelLoader(registry)
rec_service = RecommendationService()
rec_service.initialize()

MAPPINGS = {
    "couch": {"category": "Living Room", "query": "tv stand table"},
    "tv": {"category": "Living Room", "query": "sofa"},
    "bed": {"category": "Bedroom", "query": "wardrobe"},
    "dining table": {"category": "Dining Room", "query": "chair"}
}

class VisualRecommendationService:
    def __init__(self):
        self.orchestrator = AIOrchestrator(loader=global_loader)
        self.rec_service = rec_service

    async def evaluate(self, image_file: UploadFile, available_products: List[ProductMetadata]) -> VisualRecommendationResponse:
        try:
            image_bytes = await image_file.read()
            if not image_bytes:
                raise ValueError("Uploaded image is empty")

            np_arr = np.frombuffer(image_bytes, np.uint8)
            image_cv2 = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

            if image_cv2 is None:
                raise ValueError("Failed to decode image. Invalid image format.")

            image_height, image_width = image_cv2.shape[:2]
            spatial_result = self.orchestrator.analyze_spatial_layout(image_cv2)
            
            # Extract qualitative space availability
            congestion_index = calculate_congestion_index(spatial_result, image_width, image_height)
            is_region_clear, nearest_depth = evaluate_placement_region(spatial_result)
            
            space_availability = "Moderate"
            if congestion_index > 0.7 or not is_region_clear:
                space_availability = "Limited"
            elif congestion_index < 0.4 and is_region_clear:
                space_availability = "Generous"

            best_obj = None
            for obj_dist in spatial_result.object_distances:
                obj = obj_dist.detected_object
                if obj.class_name in MAPPINGS:
                    if best_obj is None or obj.confidence > best_obj.confidence:
                        best_obj = obj
            
            if best_obj:
                mapping = MAPPINGS[best_obj.class_name]
                context = VisualContext(
                    detected_class=best_obj.class_name,
                    confidence=best_obj.confidence,
                    mapped_category=mapping["category"],
                    search_query=mapping["query"],
                    space_availability=space_availability
                )
                prefs = RecommendationPreferences(category=mapping["category"], query=mapping["query"])
            else:
                context = VisualContext(
                    detected_class=None,
                    confidence=None,
                    mapped_category=None,
                    search_query=None,
                    space_availability=space_availability
                )
                prefs = RecommendationPreferences()
                
            req = RecommendationRequest(preferences=prefs, available_products=available_products)
            rec_res = self.rec_service.recommend(req)
            
            return VisualRecommendationResponse(
                recommended_product_ids=rec_res.recommended_product_ids,
                matching_info=rec_res.matching_info,
                metadata=rec_res.metadata,
                visual_context=context
            )
        except Exception as e:
            logger.error(f"Error in visual recommendation: {e}")
            raise AIServiceException(f"Visual recommendation failed: {str(e)}") from e
