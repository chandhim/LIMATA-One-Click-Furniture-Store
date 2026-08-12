import pytest
import numpy as np

from app.ml.bounding_box import BoundingBox
from app.ml.detected_object import DetectedObject
from app.ml.detection_result import DetectionResult
from app.ml.depth_result import DepthResult
from app.ml.spatial.geometry import get_bbox_center, get_bottom_center, calculate_pixel_distance
from app.ml.spatial.distance import associate_depth, sort_by_depth, calculate_scene_statistics
from app.ml.spatial.engine import SpatialAnalysisEngine

def test_geometry_helpers():
    bbox = BoundingBox(x1=10, y1=20, x2=30, y2=40)
    
    assert get_bbox_center(bbox) == (20.0, 30.0)
    assert get_bottom_center(bbox) == (20.0, 40.0)
    assert calculate_pixel_distance((0, 0), (3, 4)) == 5.0

def test_depth_association():
    bbox = BoundingBox(x1=0, y1=0, x2=2, y2=2)
    obj = DetectedObject(class_name="chair", confidence=0.9, bbox=bbox)
    
    # 3x3 depth map
    depth_map = np.array([
        [10.0, 10.0, 10.0],
        [10.0, 20.0, 20.0],
        [10.0, 20.0, 30.0]
    ])
    
    # Bbox covers [0:2, 0:2] -> 10, 10, 10, 20
    # Median of [10, 10, 10, 20] is 10.0
    obj_dist = associate_depth(obj, depth_map)
    assert obj_dist.estimated_depth == 10.0
    assert obj_dist.bbox_center == (1.0, 1.0)
    assert obj_dist.detected_object == obj

def test_sort_by_depth():
    from app.ml.spatial.result import ObjectDistance
    
    obj1 = ObjectDistance(detected_object=None, estimated_depth=10.0, bbox_center=(0,0))
    obj2 = ObjectDistance(detected_object=None, estimated_depth=30.0, bbox_center=(0,0))
    obj3 = ObjectDistance(detected_object=None, estimated_depth=20.0, bbox_center=(0,0))
    
    sorted_objs = sort_by_depth([obj1, obj2, obj3])
    
    # Highest depth first (nearest)
    assert sorted_objs[0].estimated_depth == 30.0
    assert sorted_objs[1].estimated_depth == 20.0
    assert sorted_objs[2].estimated_depth == 10.0

def test_calculate_scene_statistics():
    depth_map = np.array([
        [10.0, 20.0],
        [30.0, 40.0]
    ])
    stats = calculate_scene_statistics(depth_map, object_count=2)
    
    assert stats["object_count"] == 2.0
    assert stats["mean_depth"] == 25.0
    assert stats["min_depth"] == 10.0
    assert stats["max_depth"] == 40.0
    assert stats["variance"] == 125.0

def test_spatial_analysis_engine():
    bbox1 = BoundingBox(x1=0, y1=0, x2=2, y2=2)
    obj1 = DetectedObject("chair", 0.9, bbox1)
    
    bbox2 = BoundingBox(x1=2, y1=2, x2=4, y2=4)
    obj2 = DetectedObject("table", 0.8, bbox2)
    
    detection = DetectionResult(objects=[obj1, obj2], image_width=4, image_height=4)
    
    # Create depth map where chair area is 10, table area is 30
    depth_map = np.full((4, 4), 5.0)
    depth_map[0:2, 0:2] = 10.0
    depth_map[2:4, 2:4] = 30.0
    
    depth = DepthResult(depth_map=depth_map, image_width=4, image_height=4)
    
    engine = SpatialAnalysisEngine()
    result = engine.analyze(detection, depth)
    
    assert len(result.object_distances) == 2
    assert result.nearest_object.detected_object.class_name == "table"
    assert result.furthest_object.detected_object.class_name == "chair"
    assert result.analysis_metadata["object_count"] == 2.0
