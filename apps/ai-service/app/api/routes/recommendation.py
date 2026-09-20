from fastapi import APIRouter
from app.models.requests import RecommendationRequest
from app.models.responses import RecommendationResponse
from app.services.recommendation_service import RecommendationService

router = APIRouter()
service = RecommendationService()

@router.post("/recommend", response_model=RecommendationResponse)
async def recommend(request: RecommendationRequest):
    return service.recommend(request)
