from app.core.exceptions import NotImplementedException
from app.models.requests import DetectionRequest
from app.models.responses import DetectionResponse


class DetectionService:
    def __init__(self):
        pass

    def initialize(self):
        raise NotImplementedException("Detection model loading is not implemented yet.")

    def detect(self, request: DetectionRequest) -> DetectionResponse:
        raise NotImplementedException("Object detection inference is not implemented yet.")

    def shutdown(self):
        raise NotImplementedException("Detection service shutdown is not implemented yet.")
