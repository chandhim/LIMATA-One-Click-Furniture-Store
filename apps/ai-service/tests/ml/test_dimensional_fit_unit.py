from app.ml.bounding_box import BoundingBox
from app.ml.detected_object import DetectedObject
from app.ml.spatial.result import ObjectDistance, SpatialAnalysisResult
from app.ml.placement.result import FurnitureMetadata
from app.ml.placement.compatibility import evaluate_dimensional_fit
from app.ml.placement.config import PlacementConfig


def _empty_scene():
    return SpatialAnalysisResult(object_distances=[], analysis_metadata={"mean_depth": 0.0})


def test_dimensional_fit_missing_width_is_unavailable():
    furniture = FurnitureMetadata(width=None, depth=100, height=80, category="sofa")
    result = evaluate_dimensional_fit(_empty_scene(), furniture, 100, 100)
    assert result.status == "DIMENSIONS_UNAVAILABLE"


def test_dimensional_fit_missing_depth_is_unavailable():
    furniture = FurnitureMetadata(width=100, depth=None, height=80, category="sofa")
    result = evaluate_dimensional_fit(_empty_scene(), furniture, 100, 100)
    assert result.status == "DIMENSIONS_UNAVAILABLE"


def test_dimensional_fit_invalid_image_dims_is_insufficient_scene_data():
    furniture = FurnitureMetadata(width=100, depth=80, height=80, category="sofa")
    result = evaluate_dimensional_fit(_empty_scene(), furniture, 0, 0)
    assert result.status == "INSUFFICIENT_SCENE_DATA"


def test_dimensional_fit_small_furniture_in_clear_room_fits():
    # Empty scene -> congestion 0 -> available_space_ratio 1.0 -> full assumed frame available.
    furniture = FurnitureMetadata(width=50, depth=50, height=80, category="chair", rotatable=False)
    result = evaluate_dimensional_fit(_empty_scene(), furniture, 640, 480)
    assert result.status == "FITS"


def test_dimensional_fit_oversized_width_does_not_fit():
    # available width/depth are 0 when the room is fully congested (ratio 0), so any
    # furniture with a non-zero width will fail on width first.
    objs = []
    for _ in range(20):
        bbox = BoundingBox(x1=0, y1=0, x2=10, y2=10)
        det = DetectedObject("sofa", 1.0, bbox)
        objs.append(ObjectDistance(det, estimated_depth=1.0, bbox_center=(5, 5)))
    scene = SpatialAnalysisResult(object_distances=objs, analysis_metadata={"mean_depth": 1.0})

    furniture = FurnitureMetadata(width=200, depth=90, height=85, category="sofa", rotatable=False)
    result = evaluate_dimensional_fit(scene, furniture, 10, 100)  # matches test_congestion_index_high setup
    assert result.status in ("DOES_NOT_FIT_WIDTH", "DOES_NOT_FIT_DEPTH")


def test_dimensional_fit_rotatable_furniture_can_fit_when_rotated():
    # With an empty (fully clear) scene: available_width_cm = ASSUMED_FRAME_WIDTH_CM (400),
    # available_depth_cm = ASSUMED_FRAME_DEPTH_CM (350). A furniture piece whose depth
    # (375) exceeds available_depth_cm but whose width (1) is tiny fails at 0° (depth
    # overflow) but fits once rotated 90° (its long side becomes "width", which has more
    # room).
    assert PlacementConfig.ASSUMED_FRAME_DEPTH_CM < 375 < PlacementConfig.ASSUMED_FRAME_WIDTH_CM
    furniture_blocked_at_zero = FurnitureMetadata(
        width=1.0,
        depth=375.0,
        height=80,
        category="shelf",
        rotatable=True,
    )
    result = evaluate_dimensional_fit(_empty_scene(), furniture_blocked_at_zero, 640, 480)
    assert result.status == "FITS"
    assert result.details["orientation_used"] == "90°"


def test_dimensional_fit_non_rotatable_stays_blocked():
    furniture = FurnitureMetadata(
        width=1.0,
        depth=375.0,
        height=80,
        category="shelf",
        rotatable=False,
    )
    result = evaluate_dimensional_fit(_empty_scene(), furniture, 640, 480)
    assert result.status == "DOES_NOT_FIT_DEPTH"


def test_dimensional_fit_height_unavailable_is_reported_but_does_not_block():
    furniture = FurnitureMetadata(width=50, depth=50, height=None, category="chair")
    result = evaluate_dimensional_fit(_empty_scene(), furniture, 640, 480)
    assert result.status == "FITS"
    assert result.details["height_check"] == "unavailable"
