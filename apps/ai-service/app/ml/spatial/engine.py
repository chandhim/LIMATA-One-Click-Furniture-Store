from app.ml.detection_result import DetectionResult
from app.ml.depth_result import DepthResult
from .result import SpatialAnalysisResult
from .distance import associate_depth, sort_by_depth, calculate_scene_statistics

class SpatialAnalysisEngine:
    """
    Combines DetectionResult and DepthResult into a deterministic spatial foundation.
    
    This engine operates purely on geometric calculations and statistical reductions 
    over the provided DTOs. It contains no AI/ML inference logic.
    """
    
    def analyze(self, detection: DetectionResult, depth: DepthResult) -> SpatialAnalysisResult:
        """
        Executes the spatial analysis pipeline to merge detection and depth data.
        
        Args:
            detection (DetectionResult): The result from the object detection model.
            depth (DepthResult): The result from the depth estimation model.
            
        Returns:
            SpatialAnalysisResult: The combined deterministic spatial understanding.
        """
        
        # 1. Depth Association for all detected objects
        object_distances = []
        for obj in detection.objects:
            obj_dist = associate_depth(obj, depth.depth_map)
            object_distances.append(obj_dist)
            
        # 2. Relative Ordering
        depth_order = sort_by_depth(object_distances)
        
        nearest_object = depth_order[0] if depth_order else None
        furthest_object = depth_order[-1] if depth_order else None
        
        # 3. Scene Statistics
        analysis_metadata = calculate_scene_statistics(
            depth_map=depth.depth_map, 
            object_count=len(detection.objects)
        )
        
        return SpatialAnalysisResult(
            object_distances=object_distances,
            depth_order=depth_order,
            nearest_object=nearest_object,
            furthest_object=furthest_object,
            analysis_metadata=analysis_metadata
        )
