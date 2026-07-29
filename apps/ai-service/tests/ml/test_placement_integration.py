import pytest
import cv2
import os

from app.ml.registry import registry
from app.ml.metadata import ModelMetadata
from app.ml.constants import ModelNames
from app.ml.model_loader import ModelLoader
from app.ml.ai_orchestrator import AIOrchestrator
from app.ml.placement.result import FurnitureMetadata

SAMPLE_IMAGE_PATH = "tests/ml/bus.jpg"

@pytest.fixture(scope="module")
def setup_placement_integration():
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

def test_placement_evaluation_pipeline(setup_placement_integration):
    orchestrator, image_path = setup_placement_integration
    
    img = cv2.imread(image_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    
    furniture = FurnitureMetadata(
        width=150.0, 
        depth=80.0, 
        height=100.0, 
        category="sofa"
    )
    
    # Execute full pipeline: YOLO -> MiDaS -> Spatial -> Placement
    result = orchestrator.evaluate_placement(img, furniture)
    
    assert hasattr(result, "suitable")
    assert hasattr(result, "evaluation_confidence")
    assert hasattr(result, "warnings")
    
    # Since bus.jpg has several objects and we evaluate congestion and depth,
    # the exact result (suitable or not) depends on deterministic constraints.
    # We mainly verify the DTO generation and framework isolation here.
    
    print("\n--- Placement Evaluation Integration Test ---")
    print(f"Suitable: {result.suitable}")
    print(f"Confidence: {result.evaluation_confidence:.2f}")
    print(f"Limiting Factor: {result.limiting_factor}")
    print(f"Warnings: {result.warnings}")
    print(f"Metadata: {result.evaluation_metadata}")
