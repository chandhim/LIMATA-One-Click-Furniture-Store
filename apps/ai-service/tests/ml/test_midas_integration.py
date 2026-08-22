import pytest
import os
import time
import urllib.request
import cv2

from app.ml.registry import registry
from app.ml.metadata import ModelMetadata, ModelStatus
from app.ml.constants import ModelNames
from app.ml.model_loader import ModelLoader, ModelState
from app.ml.ai_orchestrator import AIOrchestrator

SAMPLE_IMAGE_URL = "https://ultralytics.com/images/bus.jpg"
SAMPLE_IMAGE_PATH = "tests/ml/bus.jpg"

@pytest.fixture(scope="module")
def setup_midas_integration():
    # 1. Download a sample image if it doesn't exist
    if not os.path.exists(SAMPLE_IMAGE_PATH):
        urllib.request.urlretrieve(SAMPLE_IMAGE_URL, SAMPLE_IMAGE_PATH)
    
    # 2. Register MiDaS model
    registry.clear()
    
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
    
    return loader, orchestrator, SAMPLE_IMAGE_PATH

def test_midas_end_to_end_inference(setup_midas_integration):
    loader, orchestrator, image_path = setup_midas_integration
    
    # Check initial state
    assert loader.get_runtime_status()[ModelNames.MIDAS] == ModelState.NOT_LOADED.value
    
    # Load image as numpy array (RGB)
    img = cv2.imread(image_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    
    # Run first inference (triggers loading)
    print("Running first inference...")
    result1 = orchestrator.estimate_depth(img)
    
    # Verify state transitioned to READY
    assert loader.get_runtime_status()[ModelNames.MIDAS] == ModelState.READY.value
    
    # Verify DepthResult properties
    assert result1.model_name == ModelNames.MIDAS
    assert result1.inference_time_ms > 0
    assert result1.image_width == img.shape[1]
    assert result1.image_height == img.shape[0]
    
    # Verify depth map
    assert result1.depth_map is not None
    assert result1.depth_map.shape == (img.shape[0], img.shape[1])
    
    print(f"First inference successful. Depth map shape: {result1.depth_map.shape}")
    
    # Run second inference to verify caching
    print("Running second inference (cached)...")
    start_time = time.perf_counter()
    result2 = orchestrator.estimate_depth(img)
    cached_time = time.perf_counter() - start_time
    
    # State should remain READY
    assert loader.get_runtime_status()[ModelNames.MIDAS] == ModelState.READY.value
    assert result2.model_name == ModelNames.MIDAS
    assert result2.inference_time_ms > 0
    assert result2.depth_map.shape == (img.shape[0], img.shape[1])
    
    print("Second inference successful.")
