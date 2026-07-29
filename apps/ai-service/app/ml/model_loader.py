from typing import Dict, Any, Optional
from threading import Lock
from enum import Enum
from dataclasses import dataclass, field
from datetime import datetime, timezone

from ultralytics import YOLO
from app.core.exceptions import ModelNotFoundException
from .exceptions import ModelLoadException

from .registry import ModelRegistry


class ModelState(Enum):
    """
    Enumerates the possible lifecycle states of an AI model in the runtime environment.
    """
    NOT_LOADED = "not_loaded"
    LOADING = "loading"
    READY = "ready"
    FAILED = "failed"


@dataclass
class RuntimeStatus:
    """
    Strongly typed container for the real-time status of a model.
    
    Attributes:
        state (ModelState): The current operational state of the model.
        last_updated (datetime): Timestamp of the most recent state change.
        error_message (Optional[str]): Diagnostic message if the state is FAILED.
    """
    state: ModelState = ModelState.NOT_LOADED
    last_updated: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    error_message: Optional[str] = None


class ModelLoader:
    """
    Responsible for managing the runtime lifecycle of AI models in the LIMATA service.
    
    This class provides the runtime foundation for tracking model statuses, maintaining 
    a cache of loaded instances in memory, and preparing concurrency controls for 
    future thread-safe loading operations.
    """

    def __init__(self, registry: ModelRegistry) -> None:
        """
        Initializes the ModelLoader with a given ModelRegistry instance.
        Pre-allocates runtime statuses and locks for all currently registered models.
        
        Args:
            registry (ModelRegistry): The registry containing model metadata. 
                                      Injected as a dependency to decouple metadata 
                                      management from model execution.
        """
        self._registry: ModelRegistry = registry
        self._loaded_models: Dict[str, Any] = {}
        
        # Strongly typed runtime status per model
        self._runtime_status: Dict[str, RuntimeStatus] = {}
        
        # Concurrency control locks per model
        self._loading_locks: Dict[str, Lock] = {}
        
        # Pre-initialize status and locks for models already in the registry
        for metadata in self._registry.list():
            model_id = metadata.model_id
            self._runtime_status[model_id] = RuntimeStatus(state=ModelState.NOT_LOADED)
            self._loading_locks[model_id] = Lock()

    def is_loaded(self, model_name: str) -> bool:
        """
        Checks whether a specific model is currently loaded and available in memory.
        
        Args:
            model_name (str): The unique identifier of the model to check.
            
        Returns:
            bool: True if the model is currently loaded, False otherwise. 
                  Safely returns False if the model is not found in the cache.
        """
        return model_name in self._loaded_models

    def get_runtime_status(self) -> Dict[str, str]:
        """
        Retrieves the current runtime loading statuses of all tracked models.
        
        Returns:
            Dict[str, str]: A dictionary mapping model identifiers to their 
                            current runtime string status (e.g., 'loading', 'ready', 'failed').
                            Maintains the existing public API format.
        """
        return {
            model_id: status.state.value 
            for model_id, status in self._runtime_status.items()
        }

    def load_model(self, model_name: str) -> Any:
        """
        Loads a YOLO model into memory, adhering to thread-safe lazy loading principles.
        
        Args:
            model_name (str): The unique identifier of the model to load.
            
        Returns:
            Any: The loaded YOLO model instance.
            
        Raises:
            ModelNotFoundException: If the model is not registered in the ModelRegistry.
            Exception: Any error encountered during model loading.
        """
        # 1. Verify the model exists in ModelRegistry.
        if not self._registry.exists(model_name):
            raise ModelNotFoundException(model_name)

        # 2. If already loaded, immediately return the cached instance.
        if self.is_loaded(model_name):
            return self._loaded_models[model_name]

        # Ensure lock and status exist for dynamically registered models
        if model_name not in self._loading_locks:
            self._loading_locks[model_name] = Lock()
            self._runtime_status[model_name] = RuntimeStatus(state=ModelState.NOT_LOADED)

        # 3. Acquire the model-specific loading lock.
        with self._loading_locks[model_name]:
            
            # 4. Double-check whether another thread already loaded the model.
            if self.is_loaded(model_name):
                return self._loaded_models[model_name]

            # 5. Update RuntimeStatus to LOADING.
            self._runtime_status[model_name].state = ModelState.LOADING
            self._runtime_status[model_name].last_updated = datetime.now(timezone.utc)
            self._runtime_status[model_name].error_message = None

            try:
                # 6. Read the metadata from ModelRegistry.
                metadata = self._registry.get(model_name)

                # 7. Load the model
                if model_name == "midas":
                    import torch
                    # Download/Load MiDaS and its transforms
                    torch.hub.set_dir('models/midas')
                    model = torch.hub.load("intel-isl/MiDaS", "MiDaS_small", trust_repo=True)
                    midas_transforms = torch.hub.load("intel-isl/MiDaS", "transforms", trust_repo=True)
                    # Attach the transform to the model for convenience in the orchestrator
                    model.transform = midas_transforms.small_transform
                    # Evaluate mode
                    model.eval()
                else:
                    # Default to YOLO (original architecture assumption)
                    model = YOLO(metadata.weights_path)

                # 8. Store the model inside _loaded_models.
                self._loaded_models[model_name] = model

                # 9. Update RuntimeStatus to READY.
                self._runtime_status[model_name].state = ModelState.READY
                self._runtime_status[model_name].last_updated = datetime.now(timezone.utc)
                
                # 10. Return the loaded model.
                return model

            except Exception as e:
                # Error Handling: Update to FAILED, store message, and re-raise.
                self._runtime_status[model_name].state = ModelState.FAILED
                self._runtime_status[model_name].last_updated = datetime.now(timezone.utc)
                self._runtime_status[model_name].error_message = str(e)
                raise ModelLoadException(f"Failed to load model {model_name}: {e}") from e

    def get_model(self, model_name: str) -> Any:
        """
        Retrieves a loaded model instance, lazily loading it if it is not already in memory.
        
        This is the primary public entry point for accessing AI models. It guarantees 
        that consumers only interact with fully initialized models.
        
        Args:
            model_name (str): The unique identifier of the requested model.
            
        Returns:
            Any: The fully initialized AI model instance ready for inference.
            
        Raises:
            ModelNotFoundException: If the requested model is not registered.
            Exception: If an error occurs during the lazy loading process.
        """
        # 1. Validate the model exists.
        if not self._registry.exists(model_name):
            raise ModelNotFoundException(model_name)

        # 2. If the model is already READY, return the cached model.
        if self.is_loaded(model_name):
            return self._loaded_models[model_name]

        # 3. Otherwise, call load_model(model_name) and 4. Return the loaded model.
        return self.load_model(model_name)

