from app.ml.bounding_box import BoundingBox
from app.ml.detected_object import DetectedObject
from app.ml.spatial.result import ObjectDistance, SpatialAnalysisResult
from app.ml.placement.result import FurnitureMetadata
from app.ml.placement.movement import evaluate_movement_space


def test_movement_space_unavailable_without_image_dims():
    scene = SpatialAnalysisResult(object_distances=[], analysis_metadata={"mean_depth": 1.0})
    result = evaluate_movement_space(scene, None, 0, 0)
    assert result.status == "MOVEMENT_SPACE_UNAVAILABLE"


def test_movement_space_unavailable_without_scene_metadata():
    scene = SpatialAnalysisResult(object_distances=[], analysis_metadata={})
    result = evaluate_movement_space(scene, None, 100, 100)
    assert result.status == "MOVEMENT_SPACE_UNAVAILABLE"


def test_movement_space_ok_for_clear_room():
    scene = SpatialAnalysisResult(object_distances=[], analysis_metadata={"mean_depth": 1.0})
    result = evaluate_movement_space(scene, None, 640, 480)
    assert result.status == "MOVEMENT_SPACE_OK"


def test_movement_space_restricted_when_nearest_obstacle_too_close():
    bbox = BoundingBox(x1=0, y1=0, x2=10, y2=10)
    det = DetectedObject("chair", 1.0, bbox)
    nearest = ObjectDistance(det, estimated_depth=100.0, bbox_center=(5, 5))
    scene = SpatialAnalysisResult(
        object_distances=[nearest],
        nearest_object=nearest,
        analysis_metadata={"mean_depth": 20.0},  # 100 > 20*2 -> not clear
    )
    result = evaluate_movement_space(scene, None, 640, 480)
    assert result.status in ("MOVEMENT_SPACE_RESTRICTED", "MOVEMENT_SPACE_SEVERELY_RESTRICTED")


def test_movement_space_severely_restricted_when_scene_highly_congested():
    objs = []
    for _ in range(20):
        bbox = BoundingBox(x1=0, y1=0, x2=10, y2=10)
        det = DetectedObject("sofa", 1.0, bbox)
        objs.append(ObjectDistance(det, estimated_depth=1.0, bbox_center=(5, 5)))
    scene = SpatialAnalysisResult(object_distances=objs, analysis_metadata={"mean_depth": 1.0})

    result = evaluate_movement_space(scene, None, 10, 100)  # congestion_index == 1.0
    assert result.status == "MOVEMENT_SPACE_SEVERELY_RESTRICTED"


def test_movement_space_accounts_for_candidate_furniture_footprint():
    scene = SpatialAnalysisResult(object_distances=[], analysis_metadata={"mean_depth": 1.0})
    small_furniture = FurnitureMetadata(width=10, depth=10, height=80, category="chair")
    large_furniture = FurnitureMetadata(width=390, depth=340, height=80, category="sofa")

    small_result = evaluate_movement_space(scene, small_furniture, 640, 480)
    large_result = evaluate_movement_space(scene, large_furniture, 640, 480)

    assert small_result.details["projected_congestion"] < large_result.details["projected_congestion"]
