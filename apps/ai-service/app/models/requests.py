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


class ARPlacementContext(BaseModel):
    suitable: Optional[bool] = None
    limiting_factor: Optional[str] = None
    estimated_clearance: Optional[float] = None
    warnings: List[str] = []


class DepthAnalysis(BaseModel):
    space_availability: Optional[str] = None


class SpatialAnalysis(BaseModel):
    congestion: Optional[str] = None


class RecommendationContext(BaseModel):
    productId: str
    match_score: Optional[float] = None
    reasons: List[str] = []


class AIContext(BaseModel):
    conversationId: Optional[str] = None
    available_products: List[ProductMetadata] = []
    detected_objects: List[str] = []
    depth_analysis: Optional[DepthAnalysis] = None
    spatial_analysis: Optional[SpatialAnalysis] = None
    recommendations: List[RecommendationContext] = []
    ar_placement: Optional[ARPlacementContext] = None


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    context: Optional[AIContext] = None
    history: List[ChatMessage] = []
