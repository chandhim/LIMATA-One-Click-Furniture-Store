import os
from google import genai
from google.genai import types
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()
# Also search candidate locations (apps/ai-service/.env and repo root .env)
for candidate in [
    Path(__file__).resolve().parent.parent.parent / ".env",
    Path(__file__).resolve().parent.parent.parent.parent.parent / ".env",
]:
    if candidate.exists():
        load_dotenv(dotenv_path=candidate)

class GeminiClient:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is missing")
        self.client = genai.Client(api_key=api_key)
        self.model_name = "gemini-3.1-flash-lite"

    def generate_chat_response(self, system_instruction: str, history: list, message: str, require_json: bool = False) -> str:
        contents = []
        for msg in history:
            # Map frontend roles to Gemini roles if needed (user -> user, assistant -> model)
            role = "model" if msg.role == "assistant" else "user"
            contents.append(
                types.Content(
                    role=role,
                    parts=[types.Part.from_text(text=msg.content)]
                )
            )
        
        contents.append(
            types.Content(
                role="user",
                parts=[types.Part.from_text(text=message)]
            )
        )

        config_args = {
            "system_instruction": system_instruction,
            "temperature": 0.7,
        }
        if require_json:
            config_args["response_mime_type"] = "application/json"

        response = self.client.models.generate_content(
            model=self.model_name,
            contents=contents,
            config=types.GenerateContentConfig(**config_args)
        )
        return response.text

    def generate_json(self, system_instruction: str, prompt: str) -> str:
        """Single-prompt → structured JSON. No chat history needed."""
        response = self.client.models.generate_content(
            model=self.model_name,
            contents=[
                types.Content(
                    role="user",
                    parts=[types.Part.from_text(text=prompt)]
                )
            ],
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.2,          # Low temperature for deterministic scoring
                response_mime_type="application/json",
            )
        )
        return response.text
