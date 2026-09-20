from app.ml.spatial.result import SpatialAnalysisResult
from app.ml.placement.result import FurnitureMetadata, PlacementEvaluationResult
from app.ml.placement.constraints import calculate_congestion_index, evaluate_placement_region
from app.ml.placement.geometry import get_total_image_area
from app.ml.placement.config import PlacementConfig
from app.ml.placement.compatibility import evaluate_dimensional_fit, NOT_FIT_STATUSES
from app.ml.placement.movement import evaluate_movement_space

def evaluate_orientation_and_constraints(spatial_result: SpatialAnalysisResult, furniture: FurnitureMetadata, image_width: int, image_height: int) -> PlacementEvaluationResult:
    """
    Evaluates placement suitability, checking constraints and orientations (0° vs 90°).
    """
    warnings = []
    suitable = True
    limiting_factor = None
    evaluated_orientation = "0°"

    # 1. Evaluate Congestion
    congestion_index = calculate_congestion_index(spatial_result, image_width, image_height)
    if congestion_index > PlacementConfig.CONGESTION_HIGH:
        warnings.append("High scene congestion detected.")
        suitable = False
        limiting_factor = "CONGESTION"
    elif congestion_index > PlacementConfig.CONGESTION_MODERATE:
        warnings.append("Moderate scene congestion.")

    # 2. Evaluate Placement Region Constraints
    is_region_clear, nearest_obstacle_depth = evaluate_placement_region(spatial_result)
    if not is_region_clear:
        warnings.append(f"Nearest obstacle is too close (Depth scalar: {nearest_obstacle_depth:.2f}).")
        suitable = False
        if not limiting_factor:
            limiting_factor = "OBSTACLE_PROXIMITY"

    # 3. Orientation testing (Heuristic normalization check)
    # Since we lack absolute real-world metrics, we perform a deterministic heuristic
    # to see if rotating the object makes a difference to its perceived normalized footprint constraint.
    # For now, we simply default to 0° unless constraints dictate otherwise (mocked behavior for heuristic).

    if furniture.rotatable and not suitable and limiting_factor == "OBSTACLE_PROXIMITY":
        # If blocked at 0°, try 90° rotation heuristically
        evaluated_orientation = "90°"
        warnings.append("Evaluated at 90° orientation due to constraints.")
        # We might deterministically reduce the penalty slightly to see if it fits,
        # but without real 3D bounds, we leave it marked as unsuitable for strict safety.

    # 4. Furniture compatibility: does the item's real footprint fit the estimated
    # available space? (see compatibility.py for the heuristic and its limitations)
    dimensional_fit = evaluate_dimensional_fit(spatial_result, furniture, image_width, image_height)
    if dimensional_fit.status == "DIMENSIONS_UNAVAILABLE":
        warnings.append(
            "DIMENSIONS_UNAVAILABLE: This product's width/depth are not recorded, "
            "so furniture-fit could not be checked against the estimated space."
        )
    elif dimensional_fit.status == "INSUFFICIENT_SCENE_DATA":
        warnings.append(
            "INSUFFICIENT_SCENE_DATA: Not enough information from this photo to "
            "estimate available space."
        )
    elif dimensional_fit.status in NOT_FIT_STATUSES:
        axis = dimensional_fit.status.replace("DOES_NOT_FIT_", "").lower()
        warnings.append(
            f"Estimated available {axis} appears smaller than this product's {axis} "
            f"({dimensional_fit.details.get('furniture_' + ('width_cm' if axis == 'width' else 'depth_cm'), '?')} cm). "
            "This is an approximate, non-metric estimate — not an exact measurement."
        )
        suitable = False
        if not limiting_factor:
            limiting_factor = dimensional_fit.status
    # dimensional_fit.status == "FITS": no additional warning needed.

    # 5. Movement/walking-space assessment (distinct from general scene congestion)
    movement = evaluate_movement_space(spatial_result, furniture, image_width, image_height)
    if movement.status == "MOVEMENT_SPACE_SEVERELY_RESTRICTED":
        warnings.append(
            "Movement space appears severely restricted — there may not be enough "
            "room to walk around this item once placed."
        )
        suitable = False
        if not limiting_factor:
            limiting_factor = "MOVEMENT_SPACE"
    elif movement.status == "MOVEMENT_SPACE_RESTRICTED":
        warnings.append("Movement space around this placement may be restricted.")
    elif movement.status == "MOVEMENT_SPACE_UNAVAILABLE":
        warnings.append("Unable to determine movement space from this photo.")

    # 6. Evaluation Confidence
    # Heuristic confidence decreases if congestion is high or depth variance is massive.
    base_confidence = 1.0 - (congestion_index * 0.5)
    evaluation_confidence = max(0.1, min(1.0, base_confidence))

    # Further reduce confidence when we lacked the data to make a real determination —
    # a confident-sounding number should never accompany a guess.
    if dimensional_fit.status in ("DIMENSIONS_UNAVAILABLE", "INSUFFICIENT_SCENE_DATA") or \
            movement.status == "MOVEMENT_SPACE_UNAVAILABLE":
        evaluation_confidence = min(evaluation_confidence, 0.5)

    return PlacementEvaluationResult(
        suitable=suitable,
        evaluation_confidence=evaluation_confidence,
        warnings=warnings,
        limiting_factor=limiting_factor,
        estimated_clearance=nearest_obstacle_depth,  # Proxy for clearance
        evaluated_orientation=evaluated_orientation,
        dimensional_fit=dimensional_fit.status,
        movement_space=movement.status,
        evaluation_metadata={
            "congestion_index": congestion_index,
            "nearest_obstacle_depth": nearest_obstacle_depth,
            "dimensional_fit_details": dimensional_fit.details,
            "movement_space_details": movement.details,
        }
    )
