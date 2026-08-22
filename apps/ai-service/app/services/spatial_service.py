from app.core.exceptions import NotImplementedException
from app.models.requests import SpatialAnalysisRequest
from app.models.responses import SpatialAnalysisResponse


class SpatialService:
    def __init__(self):
        pass

    def initialize(self):
        raise NotImplementedException("Spatial analysis initialization is not implemented yet.")

    def analyze(self, request: SpatialAnalysisRequest) -> SpatialAnalysisResponse:
        raise NotImplementedException("Spatial analysis logic is not implemented yet.")

    def shutdown(self):
        raise NotImplementedException("Spatial service shutdown is not implemented yet.")
