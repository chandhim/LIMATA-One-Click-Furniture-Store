import json
from app.models.requests import ChatRequest
from app.models.responses import ChatResponse
from app.core.gemini_client import GeminiClient


class ChatbotService:
    def __init__(self):
        self.client = None

    def initialize(self):
        self.client = GeminiClient()

    def chat(self, request: ChatRequest) -> ChatResponse:
        if not self.client:
            self.initialize()

        context = request.context
        if context:
            available_products = [p.model_dump() for p in context.available_products]
            room_context_json = context.model_dump_json(exclude={'available_products', 'conversationId'}, indent=2)
        else:
            available_products = []
            room_context_json = "No room context provided."
        
        system_instruction = (
            "You are the LIMATA AI Furniture Assistant. You help customers discover furniture, "
            "understand products, compare products, receive recommendations, and make purchasing decisions.\n"
            "You are NOT a generic customer-support agent.\n"
            "GROUNDING RULES:\n"
            "1. Use only supplied LIMATA product information when making claims about products.\n"
            "2. Never invent product names, prices, materials, dimensions, availability, specifications, or product IDs.\n"
            "3. If the supplied context does not contain the required information, clearly say the information is unavailable.\n"
            "4. Do not fabricate products or claim that a product exists unless it is present in the supplied context.\n"
            "5. Give concise, helpful furniture-focused answers.\n"
            "6. Ask a clarification question when required information is missing.\n"
            "7. Maintain conversation context when responding to follow-up questions.\n"
            "8. Do NOT list product names or prices in the 'reply' text. Provide the products only in the 'recommended_product_ids' array, and the UI will automatically render them as a grid.\n"
            "9. Use the provided AIContext to answer questions about the user's room and furniture. Treat supplied AI results as factual context.\n"
            "10. Do not invent objects, dimensions, measurements, clearance, depth, recommendations, or placement results.\n"
            "11. Do not claim an object was detected unless present in detected_objects. Distinguish detected objects from recommended products. 'Not detected' does NOT mean 'does not exist'.\n"
            "12. Explain existing spatial/AR results rather than replacing them. Do not independently calculate AR suitability.\n"
            "13. Format your response using clear, short paragraphs to improve readability. Do not output a single dense block of text.\n\n"
            "IMPORTANT: You MUST return your response as a valid JSON object matching the following schema:\n"
            "{\n"
            '  "reply": "Your conversational response text here",\n'
            '  "recommended_product_ids": ["productId1", "productId2", ...] // List of recommended product IDs, or empty array if none\n'
            "}\n\n"
            f"AIContext (Room Analysis Context):\n{room_context_json}\n\n"
            f"AVAILABLE PRODUCTS IN CONTEXT:\n{json.dumps(available_products, indent=2)}"
        )

        response_text = self.client.generate_chat_response(
            system_instruction=system_instruction,
            history=request.history,
            message=request.message,
            require_json=True
        )
        
        try:
            parsed = json.loads(response_text)
            return ChatResponse(
                reply=parsed.get("reply", "Sorry, I couldn't process that request."),
                recommended_product_ids=parsed.get("recommended_product_ids", [])
            )
        except json.JSONDecodeError:
            return ChatResponse(reply=response_text)

    def shutdown(self):
        pass
