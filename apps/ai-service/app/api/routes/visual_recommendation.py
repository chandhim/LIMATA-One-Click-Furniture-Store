import json
from fastapi import APIRouter, File, Form, UploadFile, HTTPException
from typing import List
from app.models.requests import ProductMetadata
from app.models.responses import VisualRecommendationResponse
from app.services.visual_recommendation_service import VisualRecommendationService

router = APIRouter()
service = VisualRecommendationService()

@router.post("/visual-recommend", response_model=VisualRecommendationResponse)
async def visual_recommend(
    image: UploadFile = File(...),
    available_products: str = Form(...)
):
    try:
        products_list = json.loads(available_products)
        products = [ProductMetadata(**p) for p in products_list]
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid available_products format: {e}")
        
    return await service.evaluate(image, products)
