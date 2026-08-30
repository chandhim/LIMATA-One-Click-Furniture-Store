from app.ml.spatial.result import SpatialAnalysisResult
from app.ml.placement.result import FurnitureMetadata, PlacementEvaluationResult
from app.ml.placement.evaluator import evaluate_orientation_and_constraints

class PlacementEvaluationEngine:
    """
    Determines whether a selected furniture item can be reasonably accommodated 
    within the analysed room, purely based on deterministic heuristics.
    
    This engine consumes the deterministic SpatialAnalysisResult and FurnitureMetadata.
    It performs no AI inference, room reconstruction, or SLAM.
    """
    
    def evaluate(self, spatial_result: SpatialAnalysisResult, furniture: FurnitureMetadata, image_width: int, image_height: int) -> PlacementEvaluationResult:
        """
        Executes the placement evaluation pipeline.
        
        Args:
            spatial_result (SpatialAnalysisResult): The existing spatial foundation.
            furniture (FurnitureMetadata): Constraints of the furniture item.
            image_width (int): The original image width to compute areas against.
            image_height (int): The original image height.
            
        Returns:
            PlacementEvaluationResult: The deterministic evaluation output.
        """
        
        return evaluate_orientation_and_constraints(
            spatial_result=spatial_result,
            furniture=furniture,
            image_width=image_width,
            image_height=image_height
        )
