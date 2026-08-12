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
    # Mock the return value of evaluate_placement
    mock_evaluate.return_value = PlacementEvaluationResult(
        suitable=True,
        warnings=[],
        evaluation_confidence=0.9
    )

    # Create a dummy image
    img = np.zeros((100, 100, 3), dtype=np.uint8)
    _, img_encoded = cv2.imencode('.jpg', img)
    img_bytes = img_encoded.tobytes()

    furniture_metadata = {
        "width": 1.0,
        "height": 1.0,
        "depth": 1.0,
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
    # Test our backend DIMENSIONS_UNAVAILABLE injection
    warnings = data.get("warnings", [])
    has_dim_warning = any("DIMENSIONS_UNAVAILABLE" in w for w in warnings)
    assert has_dim_warning

def test_placement_endpoint_missing_image():
    furniture_metadata = {
        "width": 1.0,
        "height": 1.0,
        "depth": 1.0,
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
