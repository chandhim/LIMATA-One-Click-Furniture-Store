from app.core.exceptions import NotImplementedException
from app.models.requests import ChatRequest
from app.models.responses import ChatResponse


class ChatbotService:
    def __init__(self):
        pass

    def initialize(self):
        raise NotImplementedException("Chatbot model loading is not implemented yet.")

    def chat(self, request: ChatRequest) -> ChatResponse:
        raise NotImplementedException("Chatbot inference is not implemented yet.")

    def shutdown(self):
        raise NotImplementedException("Chatbot service shutdown is not implemented yet.")
