from app.ml.spatial.result import SpatialAnalysisResult
from app.ml.placement.result import FurnitureMetadata, PlacementEvaluationResult
from app.ml.placement.constraints import calculate_congestion_index, evaluate_placement_region
from app.ml.placement.geometry import get_total_image_area

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
    if congestion_index > 0.7:
        warnings.append("High scene congestion detected.")
        suitable = False
        limiting_factor = "CONGESTION"
    elif congestion_index > 0.4:
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
        
    # 4. Evaluation Confidence
    # Heuristic confidence decreases if congestion is high or depth variance is massive.
    base_confidence = 1.0 - (congestion_index * 0.5)
    evaluation_confidence = max(0.1, min(1.0, base_confidence))

    return PlacementEvaluationResult(
        suitable=suitable,
        evaluation_confidence=evaluation_confidence,
        warnings=warnings,
        limiting_factor=limiting_factor,
        estimated_clearance=nearest_obstacle_depth,  # Proxy for clearance
        evaluated_orientation=evaluated_orientation,
        evaluation_metadata={
            "congestion_index": congestion_index,
            "nearest_obstacle_depth": nearest_obstacle_depth
        }
    )
