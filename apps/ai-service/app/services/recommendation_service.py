from app.core.exceptions import NotImplementedException
from app.models.requests import RecommendationRequest
from app.models.responses import RecommendationResponse


class RecommendationService:
    def __init__(self):
        pass

    def initialize(self):
        raise NotImplementedException("Recommendation engine initialization is not implemented yet.")

    def recommend(self, request: RecommendationRequest) -> RecommendationResponse:
        raise NotImplementedException("Recommendation logic is not implemented yet.")

    def shutdown(self):
        raise NotImplementedException("Recommendation service shutdown is not implemented yet.")
