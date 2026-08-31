import urllib.request
import numpy as np
import cv2
import base64
from app.core.exceptions import NotImplementedException, AIServiceException
from app.models.requests import DepthRequest
from app.models.responses import DepthResponse

from app.ml.dependencies import global_loader
from app.ml.ai_orchestrator import AIOrchestrator

class DepthService:
    def __init__(self):
        self.orchestrator = AIOrchestrator(loader=global_loader)

    def initialize(self):
        pass

    def estimate_depth(self, request: DepthRequest) -> DepthResponse:
        try:
            req = urllib.request.Request(request.image_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=10) as response:
                image_bytes = response.read()
            np_arr = np.frombuffer(image_bytes, np.uint8)
            image_cv2 = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
            
            if image_cv2 is None:
                raise ValueError("Failed to decode image from URL")

            result = self.orchestrator.estimate_depth(image_cv2)
            
            # Convert float depth map to uint8 image for base64
            depth_map = result.depth_map
            depth_min = depth_map.min()
            depth_max = depth_map.max()
            if depth_max - depth_min > 0:
                normalized = (255 * (depth_map - depth_min) / (depth_max - depth_min)).astype(np.uint8)
            else:
                normalized = np.zeros_like(depth_map, dtype=np.uint8)
                
            _, buffer = cv2.imencode('.png', normalized)
            depth_b64 = base64.b64encode(buffer).decode('utf-8')
            
            return DepthResponse(depth_map_url=f"data:image/png;base64,{depth_b64}")
            
        except Exception as e:
            raise AIServiceException(f"Depth estimation failed: {str(e)}") from e

    def shutdown(self):
        pass
