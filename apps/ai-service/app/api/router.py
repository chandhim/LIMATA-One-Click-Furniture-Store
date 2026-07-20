from fastapi import APIRouter

from app.api.routes import (
    health,
    detection,
    depth,
    analysis,
    recommendation,
    chatbot
)

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(detection.router, tags=["Detection"])
api_router.include_router(depth.router, tags=["Depth Estimation"])
api_router.include_router(analysis.router, tags=["Spatial Analysis"])
api_router.include_router(recommendation.router, tags=["Recommendations"])
api_router.include_router(chatbot.router, tags=["Chatbot"])
