import urllib.request
import numpy as np
import cv2
from app.core.exceptions import NotImplementedException, AIServiceException
from app.models.requests import SpatialAnalysisRequest
from app.models.responses import SpatialAnalysisResponse

from app.ml.dependencies import global_loader
from app.ml.ai_orchestrator import AIOrchestrator

class SpatialService:
    def __init__(self):
        self.orchestrator = AIOrchestrator(loader=global_loader)

    def initialize(self):
        pass

    def analyze(self, request: SpatialAnalysisRequest) -> SpatialAnalysisResponse:
        try:
            req = urllib.request.Request(request.image_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=10) as response:
                image_bytes = response.read()
            np_arr = np.frombuffer(image_bytes, np.uint8)
            image_cv2 = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
            
            if image_cv2 is None:
                raise ValueError("Failed to decode image from URL")

            result = self.orchestrator.analyze_spatial_layout(image_cv2)
            
            coordinates = {}
            for i, obj_dist in enumerate(result.object_distances):
                key_prefix = f"{obj_dist.detected_object.class_name}_{i}"
                coordinates[f"{key_prefix}_x"] = float(obj_dist.bbox_center[0])
                coordinates[f"{key_prefix}_y"] = float(obj_dist.bbox_center[1])
                coordinates[f"{key_prefix}_depth"] = float(obj_dist.estimated_depth)
                
            for k, v in result.analysis_metadata.items():
                coordinates[f"meta_{k}"] = float(v)

            return SpatialAnalysisResponse(
                coordinates=coordinates,
                scale=1.0
            )
            
        except Exception as e:
            raise AIServiceException(f"Spatial analysis failed: {str(e)}") from e

    def shutdown(self):
        pass
