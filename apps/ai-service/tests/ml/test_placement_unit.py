import pytest
from app.ml.bounding_box import BoundingBox
from app.ml.detected_object import DetectedObject
from app.ml.spatial.result import ObjectDistance, SpatialAnalysisResult
from app.ml.placement.result import FurnitureMetadata
from app.ml.placement.constraints import calculate_congestion_index, evaluate_placement_region
from app.ml.placement.engine import PlacementEvaluationEngine

def test_congestion_index_empty():
    spatial_result = SpatialAnalysisResult(object_distances=[], analysis_metadata={})
    idx = calculate_congestion_index(spatial_result, 100, 100)
    assert idx == 0.0

def test_congestion_index_high():
    # 20 objects, covers whole area
    objs = []
    for _ in range(20):
        bbox = BoundingBox(x1=0, y1=0, x2=10, y2=10) # Area 100
        det = DetectedObject("chair", 1.0, bbox)
        obj = ObjectDistance(det, estimated_depth=1.0, bbox_center=(5,5))
        objs.append(obj)
        
    spatial_result = SpatialAnalysisResult(object_distances=objs, analysis_metadata={})
    # image is 100x10 -> total area 1000
    # covered area = 20 * 100 = 2000. Ratio = min(1.0, 2000/1000) = 1.0
    # count congestion = min(1.0, 20 * 0.05) = 1.0
    # CI = (1.0 * 0.4) + (1.0 * 0.6) = 1.0
    idx = calculate_congestion_index(spatial_result, 10, 100)
    assert idx == 1.0

def test_evaluate_placement_region():
    # Nearest object is depth 100, mean depth is 20
    # 100 > 20*2 (40), so too close.
    bbox = BoundingBox(x1=0, y1=0, x2=10, y2=10)
    det = DetectedObject("chair", 1.0, bbox)
    nearest = ObjectDistance(det, estimated_depth=100.0, bbox_center=(5,5))
    
    spatial_result = SpatialAnalysisResult(
        object_distances=[nearest], 
        nearest_object=nearest,
        analysis_metadata={"mean_depth": 20.0}
    )
    
    is_clear, nearest_depth = evaluate_placement_region(spatial_result)
    assert not is_clear
    assert nearest_depth == 100.0

def test_placement_engine_unsuitable():
    bbox = BoundingBox(x1=0, y1=0, x2=10, y2=10)
    det = DetectedObject("chair", 1.0, bbox)
    nearest = ObjectDistance(det, estimated_depth=100.0, bbox_center=(5,5))
    
    spatial_result = SpatialAnalysisResult(
        object_distances=[nearest], 
        nearest_object=nearest,
        analysis_metadata={"mean_depth": 20.0}
    )
    
    furniture = FurnitureMetadata(width=10, depth=10, height=10, category="sofa")
    
    engine = PlacementEvaluationEngine()
    result = engine.evaluate(spatial_result, furniture, 100, 100)
    
    assert not result.suitable
    assert result.limiting_factor == "OBSTACLE_PROXIMITY"
    assert result.evaluated_orientation == "90°" # Since it was rotatable and blocked
    assert len(result.warnings) > 0

def test_placement_engine_suitable():
    bbox = BoundingBox(x1=0, y1=0, x2=10, y2=10)
    det = DetectedObject("chair", 1.0, bbox)
    nearest = ObjectDistance(det, estimated_depth=25.0, bbox_center=(5,5))
    
    spatial_result = SpatialAnalysisResult(
        object_distances=[nearest], 
        nearest_object=nearest,
        analysis_metadata={"mean_depth": 20.0}
    )
    
    furniture = FurnitureMetadata(width=10, depth=10, height=10, category="sofa")
    
    engine = PlacementEvaluationEngine()
    result = engine.evaluate(spatial_result, furniture, 100, 100)
    
    assert result.suitable
    assert result.limiting_factor is None
    assert result.evaluated_orientation == "0°"
