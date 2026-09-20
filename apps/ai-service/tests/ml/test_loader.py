import pytest
from unittest.mock import Mock, patch

from app.ml.model_loader import ModelLoader, ModelState
from app.ml.exceptions import ModelLoadException
from app.core.exceptions import ModelNotFoundException

def test_model_loader_initial_state():
    mock_registry = Mock()
    mock_metadata = Mock()
    mock_metadata.model_id = "test_model"
    mock_registry.list.return_value = [mock_metadata]
    
    loader = ModelLoader(registry=mock_registry)
    
    status = loader.get_runtime_status()
    assert status["test_model"] == ModelState.NOT_LOADED.value

def test_load_model_not_found():
    mock_registry = Mock()
    mock_registry.list.return_value = []
    mock_registry.exists.return_value = False
    
    loader = ModelLoader(registry=mock_registry)
    
    with pytest.raises(ModelNotFoundException):
        loader.load_model("unknown_model")

@patch('app.ml.model_loader.YOLO')
def test_load_model_success(mock_yolo):
    mock_registry = Mock()
    mock_metadata = Mock()
    mock_metadata.model_id = "test_model"
    mock_metadata.weights_path = "/path/to/weights.pt"
    
    mock_registry.list.return_value = [mock_metadata]
    mock_registry.exists.return_value = True
    mock_registry.get.return_value = mock_metadata
    
    mock_model_instance = Mock()
    mock_yolo.return_value = mock_model_instance
    
    loader = ModelLoader(registry=mock_registry)
    
    assert not loader.is_loaded("test_model")
    
    model = loader.load_model("test_model")
    
    assert model == mock_model_instance
    assert loader.is_loaded("test_model")
    
    status = loader.get_runtime_status()
    assert status["test_model"] == ModelState.READY.value

@patch('app.ml.model_loader.YOLO')
def test_load_model_failure(mock_yolo):
    mock_registry = Mock()
    mock_metadata = Mock()
    mock_metadata.model_id = "test_model"
    mock_metadata.weights_path = "/path/to/weights.pt"
    
    mock_registry.list.return_value = [mock_metadata]
    mock_registry.exists.return_value = True
    mock_registry.get.return_value = mock_metadata
    
    mock_yolo.side_effect = Exception("Corrupted weights file")
    
    loader = ModelLoader(registry=mock_registry)
    
    with pytest.raises(ModelLoadException) as exc_info:
        loader.load_model("test_model")
        
    assert "Corrupted weights file" in str(exc_info.value)
    
    status = loader.get_runtime_status()
    assert status["test_model"] == ModelState.FAILED.value
