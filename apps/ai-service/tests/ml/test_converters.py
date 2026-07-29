import pytest
from unittest.mock import Mock

from app.ml.converters import convert_yolo_results
from app.ml.constants import ModelNames

def test_convert_empty_results():
    result = convert_yolo_results([], ModelNames.YOLO, 10.0)
    assert len(result.objects) == 0
    assert result.model_name == ModelNames.YOLO
    assert result.inference_time_ms == 10.0

def test_convert_yolo_results_with_detections():
    # Mocking ultralytics Results object
    mock_box = Mock()
    mock_box.xyxy = [[10.0, 20.0, 30.0, 40.0]]
    mock_box.conf = [0.95]
    mock_box.cls = [0]
    
    mock_result = Mock()
    mock_result.orig_shape = (1080, 1920)
    mock_result.boxes = [mock_box]
    mock_result.names = {0: "chair"}
    
    result = convert_yolo_results([mock_result], ModelNames.YOLO, 120.5)
    
    assert result.image_height == 1080
    assert result.image_width == 1920
    assert result.model_name == ModelNames.YOLO
    assert result.inference_time_ms == 120.5
    
    assert len(result.objects) == 1
    obj = result.objects[0]
    assert obj.class_name == "chair"
    assert obj.confidence == 0.95
    assert obj.bbox.x1 == 10.0
    assert obj.bbox.y1 == 20.0
    assert obj.bbox.x2 == 30.0
    assert obj.bbox.y2 == 40.0
