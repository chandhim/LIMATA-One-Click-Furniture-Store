from fastapi.testclient import TestClient
from app.main import app
import json
import cv2
import numpy as np
from unittest.mock import patch
from app.ml.placement.result import PlacementEvaluationResult

client = TestClient(app)

@patch("app.services.placement_service.AIOrchestrator.evaluate_placement")
def test_placement_endpoint_valid(mock_evaluate):
    # Mock the return value of evaluate_placement. Dimensions are unknown for this
    # product (width/height/depth = None), so the evaluator would report
    # DIMENSIONS_UNAVAILABLE — we assert that status passes through the API untouched.
    mock_evaluate.return_value = PlacementEvaluationResult(
        suitable=True,
        warnings=["DIMENSIONS_UNAVAILABLE: This product's width/depth are not recorded, so furniture-fit could not be checked against the estimated space."],
        evaluation_confidence=0.5,
        dimensional_fit="DIMENSIONS_UNAVAILABLE",
        movement_space="MOVEMENT_SPACE_OK",
    )

    # Create a dummy image
    img = np.zeros((100, 100, 3), dtype=np.uint8)
    _, img_encoded = cv2.imencode('.jpg', img)
    img_bytes = img_encoded.tobytes()

    furniture_metadata = {
        "width": None,
        "height": None,
        "depth": None,
        "category": "Sofa",
        "rotatable": True
    }

    response = client.post(
        "/placement",
        files={"image": ("test.jpg", img_bytes, "image/jpeg")},
        data={"furniture_metadata": json.dumps(furniture_metadata)}
    )

    assert response.status_code == 200
    data = response.json()
    # It might fail with a specific exception if models aren't loaded, or return a result
    # We just ensure it's a 200 and has the expected schema fields from PlacementEvaluationResult
    assert "suitable" in data
    assert "warnings" in data
    assert data["dimensional_fit"] == "DIMENSIONS_UNAVAILABLE"
    assert data["movement_space"] == "MOVEMENT_SPACE_OK"
    assert data["alternative_recommendations"] == []
    # Missing dimensions must never be silently reported as a confident fit.
    warnings = data.get("warnings", [])
    has_dim_warning = any("DIMENSIONS_UNAVAILABLE" in w for w in warnings)
    assert has_dim_warning

@patch("app.services.placement_service.AIOrchestrator.evaluate_placement")
def test_placement_endpoint_with_available_products(mock_evaluate):
    # When the primary item doesn't fit, the endpoint should pass parsed
    # available_products through to the orchestrator and surface whatever
    # alternative_recommendations it returns.
    mock_evaluate.return_value = PlacementEvaluationResult(
        suitable=False,
        warnings=["Estimated available width appears smaller than this product's width."],
        evaluation_confidence=0.6,
        limiting_factor="DOES_NOT_FIT_WIDTH",
        dimensional_fit="DOES_NOT_FIT_WIDTH",
        movement_space="MOVEMENT_SPACE_OK",
        alternative_recommendations=[
            {"productId": "prod-2", "reason": "Estimated to fit.", "orientation": "0°", "footprint_cm2": 12600.0}
        ],
    )

    img = np.zeros((100, 100, 3), dtype=np.uint8)
    _, img_encoded = cv2.imencode('.jpg', img)
    img_bytes = img_encoded.tobytes()

    furniture_metadata = {"width": 220.0, "height": 85.0, "depth": 90.0, "category": "Living Room", "rotatable": True}
    available_products = [
        {"productId": "prod-2", "name": "Compact Sofa", "description": "d", "category": "Living Room", "price": 100, "stock": 1, "width": 140.0, "depth": 90.0, "height": 85.0}
    ]

    response = client.post(
        "/placement",
        files={"image": ("test.jpg", img_bytes, "image/jpeg")},
        data={
            "furniture_metadata": json.dumps(furniture_metadata),
            "available_products": json.dumps(available_products),
        }
    )

    assert response.status_code == 200
    data = response.json()
    assert data["dimensional_fit"] == "DOES_NOT_FIT_WIDTH"
    assert data["alternative_recommendations"][0]["productId"] == "prod-2"

    # The orchestrator must have received the parsed ProductMetadata list.
    _, kwargs = mock_evaluate.call_args
    assert kwargs["available_products"] is not None
    assert kwargs["available_products"][0].productId == "prod-2"

def test_placement_endpoint_missing_image():
    furniture_metadata = {
        "width": None,
        "height": None,
        "depth": None,
        "category": "Sofa",
        "rotatable": True
    }

    response = client.post(
        "/placement",
        data={"furniture_metadata": json.dumps(furniture_metadata)}
    )

    # FastAPI should return 422 Unprocessable Entity for missing required UploadFile
    assert response.status_code == 422

def test_placement_endpoint_invalid_metadata():
    # Create a dummy image
    img = np.zeros((10, 10, 3), dtype=np.uint8)
    _, img_encoded = cv2.imencode('.jpg', img)
    img_bytes = img_encoded.tobytes()

    response = client.post(
        "/placement",
        files={"image": ("test.jpg", img_bytes, "image/jpeg")},
        data={"furniture_metadata": "not-a-json-string"}
    )

    # We raise 400 Bad Request manually in placement.py for invalid JSON
    assert response.status_code == 400

def test_placement_endpoint_invalid_available_products():
    img = np.zeros((10, 10, 3), dtype=np.uint8)
    _, img_encoded = cv2.imencode('.jpg', img)
    img_bytes = img_encoded.tobytes()

    furniture_metadata = {"width": None, "height": None, "depth": None, "category": "Sofa", "rotatable": True}

    response = client.post(
        "/placement",
        files={"image": ("test.jpg", img_bytes, "image/jpeg")},
        data={
            "furniture_metadata": json.dumps(furniture_metadata),
            "available_products": "not-a-json-string",
        }
    )

    assert response.status_code == 400
