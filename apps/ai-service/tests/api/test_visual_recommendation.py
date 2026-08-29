from fastapi.testclient import TestClient
from app.main import app
import json
import cv2
import numpy as np
from unittest.mock import patch
from app.ml.detection_result import DetectionResult
from app.ml.detected_object import DetectedObject

client = TestClient(app)

def _create_mock_image():
    img = np.zeros((10, 10, 3), dtype=np.uint8)
    _, img_encoded = cv2.imencode('.jpg', img)
    return img_encoded.tobytes()

from app.ml.bounding_box import BoundingBox

from app.ml.spatial.result import SpatialAnalysisResult, ObjectDistance

def _mock_analyze_spatial_layout(objects):
    object_distances = []
    for lbl, conf in objects:
        bbox = BoundingBox(0, 0, 10, 10)
        detected_obj = DetectedObject(class_name=lbl, confidence=conf, bbox=bbox)
        object_distances.append(ObjectDistance(detected_object=detected_obj, estimated_depth=1.0, bbox_center=(5.0, 5.0)))
    
    return SpatialAnalysisResult(
        object_distances=object_distances,
        depth_order=object_distances,
        nearest_object=object_distances[0] if object_distances else None,
        furthest_object=object_distances[-1] if object_distances else None,
        analysis_metadata={"mean_depth": 1.0}
    )

def test_visual_recommendation_couch_mapping():
    with patch("app.services.visual_recommendation_service.AIOrchestrator.analyze_spatial_layout") as mock_analyze:
        mock_analyze.return_value = _mock_analyze_spatial_layout([("couch", 0.9)])
        
        products = [
            {"productId": "1", "name": "TV Stand A", "description": "stand", "category": "Living Room", "price": 100, "stock": 5},
            {"productId": "2", "name": "Bed A", "description": "bed", "category": "Bedroom", "price": 100, "stock": 5}
        ]
        
        response = client.post(
            "/visual-recommend",
            files={"image": ("test.jpg", _create_mock_image(), "image/jpeg")},
            data={"available_products": json.dumps(products)}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["visual_context"]["detected_class"] == "couch"
        assert data["visual_context"]["mapped_category"] == "Living Room"
        # Since query is "tv stand table", product 1 should match "tv" and "stand"
        assert "1" in data["recommended_product_ids"]

def test_visual_recommendation_bed_mapping():
    with patch("app.services.visual_recommendation_service.AIOrchestrator.analyze_spatial_layout") as mock_analyze:
        mock_analyze.return_value = _mock_analyze_spatial_layout([("bed", 0.8)])
        
        products = [
            {"productId": "1", "name": "Wardrobe A", "description": "large wardrobe", "category": "Bedroom", "price": 100, "stock": 5}
        ]
        
        response = client.post(
            "/visual-recommend",
            files={"image": ("test.jpg", _create_mock_image(), "image/jpeg")},
            data={"available_products": json.dumps(products)}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["visual_context"]["detected_class"] == "bed"
        assert data["visual_context"]["mapped_category"] == "Bedroom"
        assert "1" in data["recommended_product_ids"]

def test_visual_recommendation_tv_mapping():
    with patch("app.services.visual_recommendation_service.AIOrchestrator.analyze_spatial_layout") as mock_analyze:
        mock_analyze.return_value = _mock_analyze_spatial_layout([("tv", 0.95)])
        
        products = [
            {"productId": "1", "name": "Sofa A", "description": "sofa", "category": "Living Room", "price": 100, "stock": 5}
        ]
        
        response = client.post(
            "/visual-recommend",
            files={"image": ("test.jpg", _create_mock_image(), "image/jpeg")},
            data={"available_products": json.dumps(products)}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["visual_context"]["detected_class"] == "tv"
        assert data["visual_context"]["mapped_category"] == "Living Room"
        assert "1" in data["recommended_product_ids"]

def test_visual_recommendation_dining_table_mapping():
    with patch("app.services.visual_recommendation_service.AIOrchestrator.analyze_spatial_layout") as mock_analyze:
        mock_analyze.return_value = _mock_analyze_spatial_layout([("dining table", 0.75)])
        
        products = [
            {"productId": "1", "name": "Dining Chair", "description": "chair", "category": "Dining Room", "price": 100, "stock": 5}
        ]
        
        response = client.post(
            "/visual-recommend",
            files={"image": ("test.jpg", _create_mock_image(), "image/jpeg")},
            data={"available_products": json.dumps(products)}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["visual_context"]["detected_class"] == "dining table"
        assert data["visual_context"]["mapped_category"] == "Dining Room"
        assert "1" in data["recommended_product_ids"]

def test_visual_recommendation_ignored_classes():
    with patch("app.services.visual_recommendation_service.AIOrchestrator.analyze_spatial_layout") as mock_analyze:
        mock_analyze.return_value = _mock_analyze_spatial_layout([("person", 0.99), ("dog", 0.9)])
        
        products = [
            {"productId": "1", "name": "Any Product", "description": "desc", "category": "Dining Room", "price": 100, "stock": 5}
        ]
        
        response = client.post(
            "/visual-recommend",
            files={"image": ("test.jpg", _create_mock_image(), "image/jpeg")},
            data={"available_products": json.dumps(products)}
        )
        
        assert response.status_code == 200
        data = response.json()
        # Should fallback to empty context
        assert data["visual_context"]["detected_class"] is None
        assert data["visual_context"]["mapped_category"] is None
        # Entire catalog returned as fallback
        assert "1" in data["recommended_product_ids"]

def test_visual_recommendation_empty_detection():
    with patch("app.services.visual_recommendation_service.AIOrchestrator.analyze_spatial_layout") as mock_analyze:
        mock_analyze.return_value = _mock_analyze_spatial_layout([])
        
        products = [
            {"productId": "1", "name": "Any Product", "description": "desc", "category": "Dining Room", "price": 100, "stock": 5}
        ]
        
        response = client.post(
            "/visual-recommend",
            files={"image": ("test.jpg", _create_mock_image(), "image/jpeg")},
            data={"available_products": json.dumps(products)}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["visual_context"]["detected_class"] is None
        assert "1" in data["recommended_product_ids"]

def test_visual_recommendation_highest_confidence_wins():
    with patch("app.services.visual_recommendation_service.AIOrchestrator.analyze_spatial_layout") as mock_analyze:
        mock_analyze.return_value = _mock_analyze_spatial_layout([("couch", 0.5), ("bed", 0.9)])
        
        products = []
        
        response = client.post(
            "/visual-recommend",
            files={"image": ("test.jpg", _create_mock_image(), "image/jpeg")},
            data={"available_products": json.dumps(products)}
        )
        
        assert response.status_code == 200
        data = response.json()
        # "bed" has higher confidence so it should win
        assert data["visual_context"]["detected_class"] == "bed"
        assert data["visual_context"]["mapped_category"] == "Bedroom"
