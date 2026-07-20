from fastapi import APIRouter
from app.models.requests import SpatialAnalysisRequest
from app.models.responses import SpatialAnalysisResponse
from app.services.spatial_service import SpatialService

router = APIRouter()
service = SpatialService()

@router.post("/analyze", response_model=SpatialAnalysisResponse)
async def analyze(request: SpatialAnalysisRequest):
    return service.analyze(request)
