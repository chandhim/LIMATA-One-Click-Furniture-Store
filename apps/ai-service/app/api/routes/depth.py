from fastapi import APIRouter
from app.models.requests import DepthRequest
from app.models.responses import DepthResponse
from app.services.depth_service import DepthService

router = APIRouter()
service = DepthService()

@router.post("/depth", response_model=DepthResponse)
async def estimate_depth(request: DepthRequest):
    return service.estimate_depth(request)
