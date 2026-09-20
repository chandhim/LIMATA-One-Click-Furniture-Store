import sys, os, json
sys.path.insert(0, 'apps/ai-service')
from dotenv import load_dotenv
load_dotenv('apps/ai-service/.env')
from google import genai
from google.genai import types

client = genai.Client(api_key=os.getenv('GEMINI_API_KEY'))

products = [
    {"productId": "1", "name": "Ergonomic Office Chair", "category": "Office", "price": 45000, "description": "High back mesh executive chair for long working hours."},
    {"productId": "2", "name": "Solid Teak Office Desk", "category": "Office", "price": 85000, "description": "Spacious computer desk with cable management."},
    {"productId": "3", "name": "Baby High Chair", "category": "Living Room", "price": 12000, "description": "Safe wooden high chair for babies and toddlers with tray."},
    {"productId": "4", "name": "Dining Room Chair Set of 4", "category": "Dining Room", "price": 35000, "description": "Upholstered dining chairs for family dining tables."},
    {"productId": "5", "name": "King Size Bed Frame", "category": "Bedroom", "price": 120000, "description": "Solid mahogany king bed with tufted headboard."},
    {"productId": "6", "name": "Modern 4-Door Wardrobe", "category": "Bedroom", "price": 95000, "description": "Large wardrobe for bedroom clothing storage."},
    {"productId": "7", "name": "Bookshelf Filing Cabinet", "category": "Office", "price": 40000, "description": "Storage cabinet and bookcase for documents and office files."}
]

system_instruction = (
    "You are a strict furniture relevance scoring engine for LIMATA, a furniture store. "
    "Your ONLY job is to score how relevant each product is to the user's request. "
    "Be STRICT: products from an unrelated room context or purpose MUST score 0. "
    "Return ONLY a valid JSON array of objects with productId, score (0-100), and reason."
)

prompt = f"""User query: "i need to furnish my office"

Score each candidate product 0-100 based on how relevant it is for furnishing an office:
- 80-100: Essential office furniture (e.g., office desks, desk chairs, office filing/bookcases)
- 50-79: Useful office accessories/furniture
- 0: Completely irrelevant furniture (e.g., baby chairs, dining chairs, beds, wardrobes, kitchen items)

Products:
{json.dumps(products, indent=2)}

Return ONLY JSON array:
[
  {{"productId": "...", "score": 85, "reason": "..."}}
]
"""

model_name = "gemini-3.1-flash-lite"
print(f"Calling Gemini with model {model_name}...")
res = client.models.generate_content(
    model=model_name,
    contents=[
        types.Content(
            role="user",
            parts=[types.Part.from_text(text=prompt)]
        )
    ],
    config=types.GenerateContentConfig(
        system_instruction=system_instruction,
        temperature=0.1,
        response_mime_type="application/json"
    )
)

print("RESPONSE:")
print(res.text)
