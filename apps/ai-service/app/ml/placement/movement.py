from dataclasses import dataclass, field
from typing import Any, Dict, Optional, Type

from app.ml.spatial.result import SpatialAnalysisResult
from app.ml.placement.result import FurnitureMetadata
from app.ml.placement.constraints import calculate_congestion_index, evaluate_placement_region
from app.ml.placement.config import PlacementConfig

MOVEMENT_STATUSES = (
    "MOVEMENT_SPACE_OK",
    "MOVEMENT_SPACE_RESTRICTED",
    "MOVEMENT_SPACE_SEVERELY_RESTRICTED",
    "MOVEMENT_SPACE_UNAVAILABLE",
)


@dataclass
class MovementSpaceResult:
    status: str
    details: Dict[str, Any] = field(default_factory=dict)


def evaluate_movement_space(
    spatial_result: SpatialAnalysisResult,
    furniture: Optional[FurnitureMetadata],
    image_width: int,
    image_height: int,
    config: Type[PlacementConfig] = PlacementConfig,
) -> MovementSpaceResult:
    """
    Estimates whether placing `furniture` (if provided) would leave enough open floor
    for a person to walk through, reusing only signals already produced by the
    existing congestion/obstacle-proximity heuristics (calculate_congestion_index,
    evaluate_placement_region) — no new computer-vision work is introduced.

    This is a coarse, single-photo, relative-depth estimate. It does not, and cannot,
    reconstruct an actual floor plan or know where doorways/walking paths are — it can
    only say whether the frame looks generally clear or generally crowded, projected
    forward by the footprint of the furniture being considered.
    """
    if image_width <= 0 or image_height <= 0:
        return MovementSpaceResult(
            status="MOVEMENT_SPACE_UNAVAILABLE",
            details={"reason": "Invalid or missing image dimensions."},
        )

    if not spatial_result.analysis_metadata:
        return MovementSpaceResult(
            status="MOVEMENT_SPACE_UNAVAILABLE",
            details={"reason": "No depth/scene statistics available for this photo."},
        )

    congestion_index = calculate_congestion_index(spatial_result, image_width, image_height)
    is_region_clear, nearest_obstacle_depth = evaluate_placement_region(spatial_result)

    added_footprint_ratio = 0.0
    if furniture is not None and furniture.width is not None and furniture.depth is not None:
        reference_area = config.ASSUMED_FRAME_WIDTH_CM * config.ASSUMED_FRAME_DEPTH_CM
        if reference_area > 0:
            added_footprint_ratio = min(1.0, (furniture.width * furniture.depth) / reference_area)

    projected_congestion = min(
        1.0, congestion_index + added_footprint_ratio * config.MOVEMENT_FOOTPRINT_WEIGHT
    )

    if projected_congestion >= config.MOVEMENT_SEVERE_CONGESTION:
        status = "MOVEMENT_SPACE_SEVERELY_RESTRICTED"
    elif not is_region_clear or projected_congestion >= config.MOVEMENT_RESTRICTED_CONGESTION:
        status = "MOVEMENT_SPACE_RESTRICTED"
    else:
        status = "MOVEMENT_SPACE_OK"

    return MovementSpaceResult(
        status=status,
        details={
            "congestion_index": round(congestion_index, 3),
            "added_footprint_ratio": round(added_footprint_ratio, 3),
            "projected_congestion": round(projected_congestion, 3),
            "nearest_obstacle_depth": nearest_obstacle_depth,
            "note": (
                "Estimated from relative depth/congestion in a single photo — not a "
                "reconstructed floor plan and not aware of doorways or walking paths."
            ),
        },
    )
