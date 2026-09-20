import pytest
from unittest.mock import Mock, patch

from app.ml.ai_orchestrator import AIOrchestrator
from app.ml.exceptions import AIInferenceException
from app.ml.constants import ModelNames

def test_analyze_image_success():
    mock_loader = Mock()
    mock_model = Mock()
    mock_loader.get_model.return_value = mock_model
    
    mock_model.return_value = [] # Return empty results list for simplicity
    
    orchestrator = AIOrchestrator(loader=mock_loader)
    
    result = orchestrator.analyze_image("dummy_image")
    
    mock_loader.get_model.assert_called_once_with(ModelNames.YOLO)
    mock_model.assert_called_once_with("dummy_image")
    assert result.model_name == ModelNames.YOLO
    assert result.inference_time_ms >= 0

def test_analyze_image_failure_raises_custom_exception():
    mock_loader = Mock()
    mock_model = Mock(side_effect=RuntimeError("GPU OOM"))
    mock_loader.get_model.return_value = mock_model
    
    orchestrator = AIOrchestrator(loader=mock_loader)
    
    with pytest.raises(AIInferenceException) as exc_info:
        orchestrator.analyze_image("dummy_image")
        
    assert "Failed to analyze image" in str(exc_info.value)
