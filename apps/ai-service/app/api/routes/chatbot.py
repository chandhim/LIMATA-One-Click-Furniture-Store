from fastapi import APIRouter
from app.models.requests import ChatRequest
from app.models.responses import ChatResponse
from app.services.chatbot_service import ChatbotService

router = APIRouter()
service = ChatbotService()

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    return service.chat(request)
