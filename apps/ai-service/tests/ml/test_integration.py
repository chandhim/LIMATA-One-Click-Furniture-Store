import pytest
import os
import time
import urllib.request

from app.ml.registry import registry
from app.ml.metadata import ModelMetadata, ModelStatus
from app.ml.constants import ModelNames
from app.ml.model_loader import ModelLoader, ModelState
from app.ml.ai_orchestrator import AIOrchestrator

# Sample image URL from Ultralytics
SAMPLE_IMAGE_URL = "https://ultralytics.com/images/bus.jpg"
SAMPLE_IMAGE_PATH = "tests/ml/bus.jpg"

@pytest.fixture(scope="module")
def setup_integration():
    # 1. Download a sample image if it doesn't exist
    if not os.path.exists(SAMPLE_IMAGE_PATH):
        urllib.request.urlretrieve(SAMPLE_IMAGE_URL, SAMPLE_IMAGE_PATH)
    
    # 2. Register YOLO model
    # Ensure models/yolo/yolov8n.pt exists (assumed downloaded before tests run)
    yolo_weights = os.path.abspath("models/yolo/yolov8n.pt")
    
    # Clear registry for clean state
    registry.clear()
    
    yolo_metadata = ModelMetadata(
        model_id=ModelNames.YOLO,
        display_name="YOLOv8 Nano",
        task_type="Object Detection",
        version="v8.0",
        expected_input_type="Image",
        expected_output_type="DetectionResult",
        weights_path=yolo_weights
    )
    registry.register(yolo_metadata)
    
    # Initialize Loader and Orchestrator
    loader = ModelLoader(registry=registry)
    orchestrator = AIOrchestrator(loader=loader)
    
    return loader, orchestrator, SAMPLE_IMAGE_PATH

def test_yolo_end_to_end_inference(setup_integration):
    loader, orchestrator, image_path = setup_integration
    
    # Check initial state
    assert loader.get_runtime_status()[ModelNames.YOLO] == ModelState.NOT_LOADED.value
    
    # Run first inference (this should trigger loading)
    print("Running first inference...")
    result1 = orchestrator.analyze_image(image_path)
    
    # Verify state transitioned to READY
    assert loader.get_runtime_status()[ModelNames.YOLO] == ModelState.READY.value
    
    # Verify DetectionResult properties
    assert result1.model_name == ModelNames.YOLO
    assert result1.inference_time_ms > 0
    
    # Verify at least one object detected (a bus is in bus.jpg)
    assert len(result1.objects) > 0
    # Find bus
    classes_detected = [obj.class_name for obj in result1.objects]
    assert "bus" in classes_detected
    
    print("First inference successful. Detected:", classes_detected)
    
    # Run second inference to verify caching
    print("Running second inference (cached)...")
    start_time = time.perf_counter()
    result2 = orchestrator.analyze_image(image_path)
    cached_time = time.perf_counter() - start_time
    
    # State should remain READY
    assert loader.get_runtime_status()[ModelNames.YOLO] == ModelState.READY.value
    assert result2.model_name == ModelNames.YOLO
    assert result2.inference_time_ms > 0
    assert len(result2.objects) > 0
    
    print("Second inference successful.")
