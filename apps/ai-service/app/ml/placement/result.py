from dataclasses import dataclass, field
from typing import List, Dict, Optional

@dataclass
class FurnitureMetadata:
    """
    Constraints and dimensions of the furniture being placed.
    
    Attributes:
        width (float): The width of the furniture (normalized for heuristic comparison).
        depth (float): The depth of the furniture.
        height (float): The height of the furniture.
        category (str): Type of furniture (e.g., 'sofa', 'table').
        rotatable (bool): Whether the furniture can be rotated 90 degrees.
        optional_clearance_requirements (Optional[float]): Additional required space around the item.
    """
    width: float
    depth: float
    height: float
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
        evaluation_metadata (Dict[str, float]): Internal diagnostic metrics.
    """
    suitable: bool
    evaluation_confidence: float
    warnings: List[str] = field(default_factory=list)
    limiting_factor: Optional[str] = None
    estimated_clearance: float = 0.0
    evaluated_orientation: str = "0°"
    evaluation_metadata: Dict[str, float] = field(default_factory=dict)
