from fastapi import APIRouter
from app.models.requests import DetectionRequest
from app.models.responses import DetectionResponse
from app.services.detection_service import DetectionService

router = APIRouter()
service = DetectionService()

@router.post("/detect", response_model=DetectionResponse)
async def detect(request: DetectionRequest):
    return service.detect(request)
