from pydantic import BaseModel
from typing import Optional, List, Dict, Any


class DetectionRequest(BaseModel):
    image_url: str


class DepthRequest(BaseModel):
    image_url: str


class SpatialAnalysisRequest(BaseModel):
    image_url: str
    target_object_id: Optional[str] = None


class ProductMetadata(BaseModel):
    productId: str
    name: str
    description: str
    category: str
    material: Optional[str] = None
    price: float
    stock: int


class RecommendationPreferences(BaseModel):
    query: Optional[str] = None
    max_price: Optional[float] = None
    category: Optional[str] = None
    material: Optional[str] = None


class RecommendationRequest(BaseModel):
    preferences: RecommendationPreferences = RecommendationPreferences()
    available_products: List[ProductMetadata] = []


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None
    history: List[ChatMessage] = []
