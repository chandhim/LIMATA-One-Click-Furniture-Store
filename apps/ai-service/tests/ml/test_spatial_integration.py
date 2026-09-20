import pytest
import cv2
import os

from app.ml.registry import registry
from app.ml.metadata import ModelMetadata
from app.ml.constants import ModelNames
from app.ml.model_loader import ModelLoader
from app.ml.ai_orchestrator import AIOrchestrator

SAMPLE_IMAGE_PATH = "tests/ml/bus.jpg"

@pytest.fixture(scope="module")
def setup_spatial_integration():
    # Assume bus.jpg exists from previous tests
    assert os.path.exists(SAMPLE_IMAGE_PATH), "bus.jpg missing"
    
    registry.clear()
    
    yolo_metadata = ModelMetadata(
        model_id=ModelNames.YOLO,
        display_name="YOLOv8 Nano",
        task_type="Object Detection",
        version="v8.0",
        expected_input_type="Image",
        expected_output_type="DetectionResult",
        weights_path="models/yolo/yolov8n.pt"
    )
    registry.register(yolo_metadata)
    
    midas_metadata = ModelMetadata(
        model_id=ModelNames.MIDAS,
        display_name="MiDaS Small v2.1",
        task_type="Depth Estimation",
        version="v2.1",
        expected_input_type="Image",
        expected_output_type="DepthResult",
        weights_path="models/midas/checkpoints/midas_v21_small_256.pt"
    )
    registry.register(midas_metadata)
    
    loader = ModelLoader(registry=registry)
    orchestrator = AIOrchestrator(loader=loader)
    
    return orchestrator, SAMPLE_IMAGE_PATH

def test_spatial_analysis_pipeline(setup_spatial_integration):
    orchestrator, image_path = setup_spatial_integration
    
    img = cv2.imread(image_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    
    # 1. Execute end-to-end spatial pipeline
    result = orchestrator.analyze_spatial_layout(img)
    
    # 2. Verify deterministic spatial foundation
    assert result.analysis_metadata["object_count"] > 0
    assert result.analysis_metadata["mean_depth"] > 0
    
    # Verify depth ordering
    assert len(result.depth_order) == len(result.object_distances)
    
    # The nearest object should have the largest depth value (MiDaS outputs inverse depth / disparity)
    assert result.nearest_object is not None
    assert result.furthest_object is not None
    assert result.nearest_object.estimated_depth >= result.furthest_object.estimated_depth
    
    print("\n--- Spatial Analysis Integration Test ---")
    print(f"Total Objects Detected: {result.analysis_metadata['object_count']}")
    print(f"Mean Scene Depth: {result.analysis_metadata['mean_depth']:.2f}")
    print(f"Nearest Object: {result.nearest_object.detected_object.class_name} (depth: {result.nearest_object.estimated_depth:.2f})")
    print(f"Furthest Object: {result.furthest_object.detected_object.class_name} (depth: {result.furthest_object.estimated_depth:.2f})")
