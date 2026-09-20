from dataclasses import dataclass, field
from typing import Any, Dict, Type

from app.ml.spatial.result import SpatialAnalysisResult
from app.ml.placement.result import FurnitureMetadata
from app.ml.placement.constraints import calculate_congestion_index
from app.ml.placement.config import PlacementConfig

FIT_STATUSES = (
    "FITS",
    "DOES_NOT_FIT_WIDTH",
    "DOES_NOT_FIT_DEPTH",
    "DOES_NOT_FIT_HEIGHT",
    "DIMENSIONS_UNAVAILABLE",
    "INSUFFICIENT_SCENE_DATA",
)

# Statuses that represent a genuine "this does not fit" determination, as opposed to
# "we could not determine a fit either way" (DIMENSIONS_UNAVAILABLE / INSUFFICIENT_SCENE_DATA).
NOT_FIT_STATUSES = frozenset({"DOES_NOT_FIT_WIDTH", "DOES_NOT_FIT_DEPTH", "DOES_NOT_FIT_HEIGHT"})


@dataclass
class DimensionalFitResult:
    status: str
    details: Dict[str, Any] = field(default_factory=dict)


def evaluate_dimensional_fit(
    spatial_result: SpatialAnalysisResult,
    furniture: FurnitureMetadata,
    image_width: int,
    image_height: int,
    config: Type[PlacementConfig] = PlacementConfig,
) -> DimensionalFitResult:
    """
    Heuristically compares furniture footprint (real width/depth, in cm) against an
    estimated available floor footprint derived from the existing congestion heuristic.

    IMPORTANT LIMITATION: the AI service has no camera calibration or metric depth —
    a single RGB photo, YOLO pixel boxes, and MiDaS *relative* inverse depth cannot be
    reliably converted into centimeters. `config.ASSUMED_FRAME_WIDTH_CM` /
    `ASSUMED_FRAME_DEPTH_CM` are a documented, tunable approximation of how much real
    floor a typical room photo captures, used only to keep this guidance directionally
    useful. Callers must present every result here as an estimate, never as an exact
    measurement.

    Height is intentionally never asserted to fit or not fit: the current perception
    pipeline has no ceiling/vertical reference at all, so DOES_NOT_FIT_HEIGHT is
    reserved for when scene understanding gains that capability. `details.height_check`
    reports whether furniture.height itself was even provided.
    """
    if furniture.width is None or furniture.depth is None:
        return DimensionalFitResult(
            status="DIMENSIONS_UNAVAILABLE",
            details={"reason": "Product width/depth were not recorded for this item."},
        )

    if image_width <= 0 or image_height <= 0:
        return DimensionalFitResult(
            status="INSUFFICIENT_SCENE_DATA",
            details={"reason": "Invalid or missing image dimensions."},
        )

    congestion_index = calculate_congestion_index(spatial_result, image_width, image_height)
    available_space_ratio = max(0.0, 1.0 - congestion_index)

    available_width_cm = config.ASSUMED_FRAME_WIDTH_CM * available_space_ratio
    available_depth_cm = config.ASSUMED_FRAME_DEPTH_CM * available_space_ratio

    orientations = [("0°", furniture.width, furniture.depth)]
    if furniture.rotatable and furniture.width != furniture.depth:
        orientations.append(("90°", furniture.depth, furniture.width))

    best_status = None
    best_orientation = "0°"
    for label, w, d in orientations:
        width_ok = w <= available_width_cm
        depth_ok = d <= available_depth_cm
        if width_ok and depth_ok:
            best_status = "FITS"
            best_orientation = label
            break
        if best_status is None:
            best_status = "DOES_NOT_FIT_WIDTH" if not width_ok else "DOES_NOT_FIT_DEPTH"
            best_orientation = label

    return DimensionalFitResult(
        status=best_status,
        details={
            "available_space_ratio": round(available_space_ratio, 3),
            "available_width_cm_estimate": round(available_width_cm, 1),
            "available_depth_cm_estimate": round(available_depth_cm, 1),
            "furniture_width_cm": furniture.width,
            "furniture_depth_cm": furniture.depth,
            "height_check": "unavailable" if furniture.height is None else "not_evaluated",
            "orientation_used": best_orientation,
            "calibration_note": (
                "Available width/depth are rough estimates derived from a heuristic "
                "congestion ratio, not a calibrated camera measurement."
            ),
        },
    )
