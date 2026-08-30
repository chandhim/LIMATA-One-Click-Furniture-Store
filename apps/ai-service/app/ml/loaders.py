import logging
from typing import Dict, Any, Callable

from app.core.exceptions import (
    ModelNotFoundException,
    ModelLoadException,
    ModelNotLoadedException
)
from .registry import registry
from .metadata import DeviceType, ModelStatus
from .runtime import RuntimeState

logger = logging.getLogger(__name__)

class ModelLoader:
    """
    Manages the complete runtime lifecycle of AI models.
    Supports lazy loading, caching, unloading, and device selection.
    Consumes ModelRegistry for metadata. Does NOT perform inference.
    """
    def __init__(self):
        self._runtime_states: Dict[str, RuntimeState] = {}
        logger.info("Model Loader initialized.")

    def _detect_device(self) -> DeviceType:
        """
        Framework-agnostic device detection.
        Defaults safely to CPU. Future-ready for GPU detection (e.g., via torch).
        """
        try:
            # Placeholder for torch.cuda.is_available() logic
            import torch
            if torch.cuda.is_available():
                return DeviceType.GPU
            if hasattr(torch.backends, 'mps') and torch.backends.mps.is_available():
                return DeviceType.MPS
        except ImportError:
            pass
        return DeviceType.CPU

    def load(self, model_id: str, load_fn: Callable[[str, DeviceType], Any]) -> RuntimeState:
        """
        Loads a model using the provided load_fn if not already loaded.
        load_fn is a dependency injected callable that actually instantiates the model weights.
        """
        if self.is_loaded(model_id):
            logger.info(f"Model '{model_id}' is already loaded. Returning cached instance.")
            return self._runtime_states[model_id]

        if not registry.exists(model_id):
            logger.error(f"Cannot load unknown model '{model_id}'. Please register it first.")
            raise ModelNotFoundException(model_id)

        metadata = registry.get(model_id)
        device = self._detect_device()
        
        # Verify device support from metadata
        if device not in metadata.supported_devices:
            logger.warning(f"Device '{device.value}' not supported by model '{model_id}'. Falling back to CPU.")
            device = DeviceType.CPU

        logger.info(f"Loading model '{model_id}' on device '{device.value}'...")
        metadata.status = ModelStatus.LOADING
        
        try:
            # Execute injected loading logic
            instance = load_fn(model_id, device)
            
            state = RuntimeState(
                model_id=model_id,
                instance=instance,
                device=device
            )
            self._runtime_states[model_id] = state
            metadata.status = ModelStatus.READY
            logger.info(f"Successfully loaded model '{model_id}'.")
            return state
            
        except Exception as e:
            metadata.status = ModelStatus.FAILED
            logger.error(f"Failed to load model '{model_id}': {str(e)}")
            raise ModelLoadException(model_id, str(e))

    def unload(self, model_id: str) -> None:
        """Unloads the model and clears it from memory."""
        if not self.is_loaded(model_id):
            logger.warning(f"Attempted to unload model '{model_id}' but it is not loaded.")
            return

        # Delete instance to free memory
        del self._runtime_states[model_id]
        
        # Update registry status if metadata still exists
        if registry.exists(model_id):
            registry.get(model_id).status = ModelStatus.UNLOADED
            
        logger.info(f"Successfully unloaded model '{model_id}'.")

    def get_instance(self, model_id: str) -> Any:
        """Retrieves the raw model instance."""
        if not self.is_loaded(model_id):
            raise ModelNotLoadedException(f"Model '{model_id}' is not loaded. Please load it first.")
        return self._runtime_states[model_id].instance

    def is_loaded(self, model_id: str) -> bool:
        """Checks if a model is currently loaded in memory."""
        return model_id in self._runtime_states

    def list_loaded(self) -> list[str]:
        """Lists all currently loaded model IDs."""
        return list(self._runtime_states.keys())

    def clear(self) -> None:
        """Unloads all models and clears runtime cache."""
        loaded_models = self.list_loaded()
        for model_id in loaded_models:
            self.unload(model_id)
        logger.info("All loaded models have been cleared from memory.")

# Global singleton instance
loader = ModelLoader()
