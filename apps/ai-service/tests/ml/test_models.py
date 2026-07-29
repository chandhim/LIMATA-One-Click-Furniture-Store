from unittest.mock import Mock, patch
import pytest

from app.ml.bounding_box import BoundingBox
from app.ml.detected_object import DetectedObject
from app.ml.detection_result import DetectionResult
from app.ml.constants import ModelNames

def test_bounding_box_creation():
    bbox = BoundingBox(x1=10.0, y1=20.0, x2=30.0, y2=40.0)
    assert bbox.x1 == 10.0
    assert bbox.y1 == 20.0
    assert bbox.x2 == 30.0
    assert bbox.y2 == 40.0

def test_bounding_box_immutability():
    bbox = BoundingBox(x1=10.0, y1=20.0, x2=30.0, y2=40.0)
    with pytest.raises(Exception): # dataclass frozen=True raises FrozenInstanceError
        bbox.x1 = 15.0

def test_detected_object_creation():
    bbox = BoundingBox(x1=10.0, y1=20.0, x2=30.0, y2=40.0)
    obj = DetectedObject(class_name="chair", confidence=0.95, bbox=bbox)
    assert obj.class_name == "chair"
    assert obj.confidence == 0.95
    assert obj.bbox == bbox

def test_detection_result_creation():
    bbox = BoundingBox(x1=10.0, y1=20.0, x2=30.0, y2=40.0)
    obj = DetectedObject(class_name="chair", confidence=0.95, bbox=bbox)
    
    result = DetectionResult(
        objects=[obj], 
        image_width=1920, 
        image_height=1080,
        model_name=ModelNames.YOLO,
        inference_time_ms=120.5
    )
    
    assert len(result.objects) == 1
    assert result.image_width == 1920
    assert result.image_height == 1080
    assert result.model_name == ModelNames.YOLO
    assert result.inference_time_ms == 120.5
