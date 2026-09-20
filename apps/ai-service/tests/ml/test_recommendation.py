import pytest
from app.models.requests import RecommendationRequest, RecommendationPreferences, ProductMetadata
from app.services.recommendation_service import RecommendationService

@pytest.fixture
def service():
    s = RecommendationService()
    s.initialize()
    return s

def create_product(product_id: str, name: str, desc: str, cat: str, mat: str, price: float, stock: int) -> ProductMetadata:
    return ProductMetadata(
        productId=product_id,
        name=name,
        description=desc,
        category=cat,
        material=mat,
        price=price,
        stock=stock
    )

def test_empty_catalog(service):
    request = RecommendationRequest(
        preferences=RecommendationPreferences(query="table"),
        available_products=[]
    )
    response = service.recommend(request)
    assert len(response.recommended_product_ids) == 0
    assert response.metadata.total_evaluated == 0

def test_hard_filters_stock(service):
    products = [
        create_product("1", "Table A", "Desc", "Tables", "Wood", 100, 10),
        create_product("2", "Table B", "Desc", "Tables", "Wood", 100, 0)
    ]
    request = RecommendationRequest(
        preferences=RecommendationPreferences(),
        available_products=products
    )
    response = service.recommend(request)
    assert response.metadata.total_evaluated == 2
    assert len(response.recommended_product_ids) == 1
    assert response.recommended_product_ids[0] == "1"

def test_hard_filters_max_price(service):
    products = [
        create_product("1", "Table A", "Desc", "Tables", "Wood", 150.0, 10),
        create_product("2", "Table B", "Desc", "Tables", "Wood", 250.0, 10)
    ]
    request = RecommendationRequest(
        preferences=RecommendationPreferences(max_price=200.0),
        available_products=products
    )
    response = service.recommend(request)
    assert len(response.recommended_product_ids) == 1
    assert response.recommended_product_ids[0] == "1"

def test_hard_filters_category_case_insensitive(service):
    products = [
        create_product("1", "Table A", "Desc", "Tables", "Wood", 100, 10),
        create_product("2", "Chair", "Desc", "Chairs", "Wood", 100, 10)
    ]
    request = RecommendationRequest(
        preferences=RecommendationPreferences(category=" TaBlEs "),
        available_products=products
    )
    response = service.recommend(request)
    assert len(response.recommended_product_ids) == 1
    assert response.recommended_product_ids[0] == "1"

def test_soft_scoring_material(service):
    products = [
        create_product("1", "Table A", "Desc", "Tables", "Metal", 100, 10),
        create_product("2", "Table B", "Desc", "Tables", "Solid Wood", 100, 10)
    ]
    request = RecommendationRequest(
        preferences=RecommendationPreferences(material="wooD"),
        available_products=products
    )
    response = service.recommend(request)
    assert len(response.recommended_product_ids) == 2
    # Table B gets +50 for material match
    assert response.recommended_product_ids[0] == "2"
    assert response.matching_info["2"].score == 50
    assert response.matching_info["1"].score == 0

def test_soft_scoring_query_keywords(service):
    products = [
        create_product("1", "Coffee Table", "Modern glass and steel.", "Tables", "Glass", 100, 10),
        create_product("2", "Dining Table", "Rustic wooden table.", "Tables", "Wood", 100, 10)
    ]
    request = RecommendationRequest(
        preferences=RecommendationPreferences(query="Rustic, Coffee Table!"),
        available_products=products
    )
    response = service.recommend(request)
    # query tokens: {"rustic", "coffee", "table"}
    # Product 1 tokens: {"coffee", "table", "modern", "glass", "and", "steel"} -> match "coffee", "table" -> 20 pts
    # Product 2 tokens: {"dining", "table", "rustic", "wooden"} -> match "rustic", "table" -> 20 pts
    assert len(response.recommended_product_ids) == 2
    assert response.matching_info["1"].score == 20
    assert response.matching_info["2"].score == 20

def test_tie_breaking(service):
    products = [
        create_product("Z", "Item", "Desc", "Cat", "Mat", 100, 10),
        create_product("A", "Item", "Desc", "Cat", "Mat", 100, 10)
    ]
    request = RecommendationRequest(
        preferences=RecommendationPreferences(),
        available_products=products
    )
    response = service.recommend(request)
    # Both score 0. Tie-break by productId alphabetically.
    assert response.recommended_product_ids == ["A", "Z"]

def test_zero_score_eligible(service):
    products = [
        create_product("1", "Item", "Desc", "Cat", "Mat", 100, 10)
    ]
    request = RecommendationRequest(
        preferences=RecommendationPreferences(),
        available_products=products
    )
    response = service.recommend(request)
    assert len(response.recommended_product_ids) == 1
    assert response.matching_info["1"].score == 0
    assert "Eligible product (Score: 0)" in response.matching_info["1"].reasons

def test_no_eligible_products(service):
    products = [
        create_product("1", "Item", "Desc", "Cat", "Mat", 100, 0)
    ]
    request = RecommendationRequest(
        preferences=RecommendationPreferences(),
        available_products=products
    )
    response = service.recommend(request)
    assert len(response.recommended_product_ids) == 0

def test_empty_query(service):
    products = [
        create_product("1", "Item", "Desc", "Cat", "Mat", 100, 10)
    ]
    request = RecommendationRequest(
        preferences=RecommendationPreferences(query="   "),
        available_products=products
    )
    response = service.recommend(request)
    assert len(response.recommended_product_ids) == 1
    assert response.matching_info["1"].score == 0

def test_repeated_tokens_counted_once(service):
    products = [
        create_product("1", "table table table", "a table", "Cat", "Mat", 100, 10)
    ]
    request = RecommendationRequest(
        preferences=RecommendationPreferences(query="table table"),
        available_products=products
    )
    response = service.recommend(request)
    # query tokens: {"table"}, product tokens: {"table", "a"}
    # Should get exactly 10 points.
    assert response.matching_info["1"].score == 10
