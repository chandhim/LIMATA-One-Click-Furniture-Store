import urllib.request
import numpy as np
import cv2
from app.core.exceptions import NotImplementedException, AIServiceException
from app.models.requests import DetectionRequest
from app.models.responses import DetectionResponse, BoundingBox

from app.ml.dependencies import global_loader
from app.ml.ai_orchestrator import AIOrchestrator

class DetectionService:
    def __init__(self):
        self.orchestrator = AIOrchestrator(loader=global_loader)

    def initialize(self):
        pass

    def detect(self, request: DetectionRequest) -> DetectionResponse:
        try:
            req = urllib.request.Request(request.image_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=10) as response:
                image_bytes = response.read()
            np_arr = np.frombuffer(image_bytes, np.uint8)
            image_cv2 = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
            
            if image_cv2 is None:
                raise ValueError("Failed to decode image from URL")

            result = self.orchestrator.analyze_image(image_cv2)
            
            detections = []
            for obj in result.objects:
                detections.append(BoundingBox(
                    xmin=obj.bbox.x1,
                    ymin=obj.bbox.y1,
                    xmax=obj.bbox.x2,
                    ymax=obj.bbox.y2,
                    confidence=obj.confidence,
                    label=obj.class_name
                ))
                
            return DetectionResponse(detections=detections)
            
        except Exception as e:
            raise AIServiceException(f"Detection failed: {str(e)}") from e

    def shutdown(self):
        pass
