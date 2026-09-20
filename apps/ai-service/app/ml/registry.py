from typing import Dict, List
import logging
from .metadata import ModelMetadata
from app.core.exceptions import (
    ModelAlreadyExistsException,
    ModelNotFoundException,
    InvalidMetadataException
)

logger = logging.getLogger(__name__)

class ModelRegistry:
    """
    Central catalog for all AI models used by LIMATA.
    Manages model metadata and registration only. Does NOT load weights or perform inference.
    """
    def __init__(self):
        self._registry: Dict[str, ModelMetadata] = {}
        logger.info("Model Registry initialized.")

    def register(self, metadata: ModelMetadata) -> None:
        if not isinstance(metadata, ModelMetadata):
            logger.error("Attempted to register invalid metadata type.")
            raise InvalidMetadataException("Metadata must be an instance of ModelMetadata.")
            
        if metadata.model_id in self._registry:
            logger.error(f"Duplicate registration attempt for model ID: {metadata.model_id}")
            raise ModelAlreadyExistsException(metadata.model_id)
            
        self._registry[metadata.model_id] = metadata
        logger.info(f"Successfully registered model: {metadata.model_id} (Version: {metadata.version})")

    def unregister(self, model_id: str) -> None:
        if model_id not in self._registry:
            logger.error(f"Failed to unregister. Model ID not found: {model_id}")
            raise ModelNotFoundException(model_id)
            
        del self._registry[model_id]
        logger.info(f"Unregistered model: {model_id}")

    def get(self, model_id: str) -> ModelMetadata:
        if model_id not in self._registry:
            logger.warning(f"Lookup failed. Model ID not found: {model_id}")
            raise ModelNotFoundException(model_id)
            
        return self._registry[model_id]

    def exists(self, model_id: str) -> bool:
        return model_id in self._registry

    def list(self) -> List[ModelMetadata]:
        return list(self._registry.values())

    def clear(self) -> None:
        self._registry.clear()
        logger.info("Model Registry cleared.")

# Global singleton instance
registry = ModelRegistry()
