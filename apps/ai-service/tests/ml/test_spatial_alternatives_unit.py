from app.ml.bounding_box import BoundingBox
from app.ml.detected_object import DetectedObject
from app.ml.spatial.result import ObjectDistance, SpatialAnalysisResult
from app.ml.placement.result import FurnitureMetadata
from app.ml.placement.alternatives import rank_spatial_alternatives
from app.models.requests import ProductMetadata


def _clear_scene():
    return SpatialAnalysisResult(object_distances=[], analysis_metadata={"mean_depth": 1.0})


def _congested_scene(image_width: int, image_height: int) -> SpatialAnalysisResult:
    # A single object whose bbox covers the entire frame drives congestion_index to
    # 0.6 (coverage_ratio=1.0 * 0.6 weight), so available_space_ratio = 0.4, giving
    # available_width_cm = 400*0.4 = 160 and available_depth_cm = 350*0.4 = 140 — a
    # constrained-but-nonzero budget to compare furniture footprints against.
    bbox = BoundingBox(x1=0, y1=0, x2=image_width, y2=image_height)
    det = DetectedObject("sofa", 1.0, bbox)
    obj = ObjectDistance(det, estimated_depth=1.0, bbox_center=(image_width / 2, image_height / 2))
    return SpatialAnalysisResult(object_distances=[obj], analysis_metadata={"mean_depth": 1.0})


def _product(**kwargs):
    base = dict(productId="p", name="n", description="d", category="Living Room", price=1.0, stock=1)
    base.update(kwargs)
    return ProductMetadata(**base)


def test_alternatives_prefers_smaller_fitting_candidate_over_oversized_ones():
    # Worked example from the spec: with ~160cm of available width estimated, a
    # selected 200cm-wide sofa doesn't fit; among candidates 180cm (still too wide),
    # 140cm (fits), 220cm (too wide) -> only the 140cm candidate should be returned.
    scene = _congested_scene(640, 480)
    primary = FurnitureMetadata(width=200, depth=90, height=85, category="Living Room", rotatable=False)
    candidates = [
        _product(productId="A", width=180, depth=90, height=85),
        _product(productId="B", width=140, depth=90, height=85),
        _product(productId="C", width=220, depth=90, height=85),
    ]
    result = rank_spatial_alternatives(scene, primary, candidates, 640, 480)
    ids = [r["productId"] for r in result]
    assert ids == ["B"]


def test_alternatives_excludes_different_category():
    primary = FurnitureMetadata(width=500, depth=90, height=85, category="Living Room", rotatable=False)
    candidates = [_product(productId="X", category="Office", width=50, depth=50, height=80)]
    result = rank_spatial_alternatives(_clear_scene(), primary, candidates, 640, 480)
    assert result == []


def test_alternatives_skips_candidates_without_dimensions():
    primary = FurnitureMetadata(width=500, depth=90, height=85, category="Living Room", rotatable=False)
    candidates = [_product(productId="Y", width=None, depth=None)]
    result = rank_spatial_alternatives(_clear_scene(), primary, candidates, 640, 480)
    assert result == []


def test_alternatives_returns_empty_when_no_candidate_fits():
    primary = FurnitureMetadata(width=500, depth=90, height=85, category="Living Room", rotatable=False)
    candidates = [
        _product(productId="Z1", width=450, depth=90, height=85),
        _product(productId="Z2", width=420, depth=90, height=85),
    ]
    result = rank_spatial_alternatives(_clear_scene(), primary, candidates, 640, 480)
    assert result == []


def test_alternatives_respects_limit():
    primary = FurnitureMetadata(width=500, depth=90, height=85, category="Living Room", rotatable=False)
    candidates = [
        _product(productId=f"S{i}", width=50 + i, depth=50, height=80) for i in range(10)
    ]
    result = rank_spatial_alternatives(_clear_scene(), primary, candidates, 640, 480, limit=3)
    assert len(result) == 3
