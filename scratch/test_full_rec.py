import sys, os, json
sys.path.insert(0, 'apps/ai-service')
from dotenv import load_dotenv
load_dotenv('apps/ai-service/.env')

from app.models.requests import RecommendationRequest, RecommendationPreferences, ProductMetadata
from app.services.recommendation_service import RecommendationService

req = RecommendationRequest(
    preferences=RecommendationPreferences(
        query="i need to furnish my office",
        category=None,
        max_price=None,
        material=None
    ),
    available_products=[
        ProductMetadata(
            productId="1",
            name="Ergonomic Office Chair",
            category="Office",
            material="Mesh",
            price=45000,
            stock=10,
            description="High back mesh executive chair for long working hours."
        ),
        ProductMetadata(
            productId="2",
            name="Solid Teak Office Desk",
            category="Office",
            material="Teak",
            price=85000,
            stock=5,
            description="Spacious computer desk with cable management."
        ),
        ProductMetadata(
            productId="3",
            name="Baby High Chair",
            category="Living Room",
            material="Plastic",
            price=12000,
            stock=8,
            description="Safe wooden high chair for babies and toddlers."
        ),
        ProductMetadata(
            productId="4",
            name="Dining Chair Set",
            category="Dining Room",
            material="Wood",
            price=35000,
            stock=12,
            description="Dining chairs for kitchen dining table."
        ),
        ProductMetadata(
            productId="5",
            name="King Size Bed Frame",
            category="Bedroom",
            material="Wood",
            price=120000,
            stock=3,
            description="Bed frame for master bedroom."
        ),
    ]
)

service = RecommendationService()
resp = service.recommend(req)
print("Response JSON:")
print(resp.model_dump_json(indent=2))
