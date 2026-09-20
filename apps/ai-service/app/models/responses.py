from pydantic import BaseModel
from typing import List, Dict, Any, Optional


class BoundingBox(BaseModel):
    xmin: float
    ymin: float
    xmax: float
    ymax: float
    confidence: float
    label: str


class DetectionResponse(BaseModel):
    detections: List[BoundingBox]


class DepthResponse(BaseModel):
    depth_map_url: str


class SpatialAnalysisResponse(BaseModel):
    coordinates: Dict[str, float]
    scale: float


class MatchingInfo(BaseModel):
    score: int
    reasons: List[str]


class RecommendationMetadata(BaseModel):
    total_evaluated: int
    execution_time_ms: float


class RecommendationResponse(BaseModel):
    recommended_product_ids: List[str]
    matching_info: Dict[str, MatchingInfo]
    metadata: RecommendationMetadata


class ChatResponse(BaseModel):
    reply: str
    recommended_product_ids: Optional[List[str]] = None


class VisualContext(BaseModel):
    detected_class: Optional[str] = None
    confidence: Optional[float] = None
    mapped_category: Optional[str] = None
    search_query: Optional[str] = None
    space_availability: Optional[str] = None


class VisualRecommendationResponse(BaseModel):
    recommended_product_ids: List[str]
    matching_info: Dict[str, MatchingInfo]
    metadata: RecommendationMetadata
    visual_context: VisualContext
