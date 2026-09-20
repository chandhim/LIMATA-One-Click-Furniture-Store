from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional

@dataclass
class FurnitureMetadata:
    """
    Constraints and dimensions of the furniture being placed.

    Attributes:
        width (Optional[float]): The real width of the furniture in cm, if known.
        depth (Optional[float]): The real depth of the furniture in cm, if known.
        height (Optional[float]): The real height of the furniture in cm, if known.
        category (str): Type of furniture (e.g., 'sofa', 'table').
        rotatable (bool): Whether the furniture can be rotated 90 degrees.
        optional_clearance_requirements (Optional[float]): Additional required space around the item.

    Dimensions are intentionally Optional: many catalog products do not yet have
    recorded measurements. Callers must never substitute a fabricated number for a
    missing dimension — treat `None` as "unknown" and let the dimensional-fit
    evaluator report DIMENSIONS_UNAVAILABLE instead of guessing.
    """
    width: Optional[float]
    depth: Optional[float]
    height: Optional[float]
    category: str
    rotatable: bool = True
    optional_clearance_requirements: Optional[float] = None

@dataclass
class PlacementEvaluationResult:
    """
    Represents the deterministic evaluation of a furniture placement request.

    Attributes:
        suitable (bool): Whether the placement is considered viable.
        evaluation_confidence (float): Heuristic certainty (NOT machine learning confidence).
        warnings (List[str]): List of potential placement issues (e.g., "High congestion").
        limiting_factor (Optional[str]): The primary reason for unsuitability, if any.
        estimated_clearance (float): A heuristic score representing available clearance space.
        evaluated_orientation (str): The chosen orientation ("0°" or "90°").
        evaluation_metadata (Dict[str, Any]): Internal diagnostic metrics.
        dimensional_fit (str): One of FITS, DOES_NOT_FIT_WIDTH, DOES_NOT_FIT_DEPTH,
            DOES_NOT_FIT_HEIGHT, DIMENSIONS_UNAVAILABLE, INSUFFICIENT_SCENE_DATA.
        movement_space (str): One of MOVEMENT_SPACE_OK, MOVEMENT_SPACE_RESTRICTED,
            MOVEMENT_SPACE_SEVERELY_RESTRICTED, MOVEMENT_SPACE_UNAVAILABLE.
        alternative_recommendations (List[Dict[str, Any]]): Same-category candidate
            products estimated to fit better than the selected one, populated only
            when `dimensional_fit` indicates the selected item does not fit and
            candidate dimensions were available to check.
    """
    suitable: bool
    evaluation_confidence: float
    warnings: List[str] = field(default_factory=list)
    limiting_factor: Optional[str] = None
    estimated_clearance: float = 0.0
    evaluated_orientation: str = "0°"
    evaluation_metadata: Dict[str, Any] = field(default_factory=dict)
    dimensional_fit: str = "INSUFFICIENT_SCENE_DATA"
    movement_space: str = "MOVEMENT_SPACE_UNAVAILABLE"
    alternative_recommendations: List[Dict[str, Any]] = field(default_factory=list)
