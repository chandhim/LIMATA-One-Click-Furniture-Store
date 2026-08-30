from fastapi import Request
from fastapi.responses import JSONResponse
import logging

logger = logging.getLogger(__name__)


class AIServiceException(Exception):
    """Base exception for AI Service"""
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


class NotImplementedException(AIServiceException):
    def __init__(self, message: str = "This feature is not implemented yet."):
        super().__init__(message=message, status_code=501)


class ModelNotLoadedException(AIServiceException):
    def __init__(self, message: str = "The required AI model is not loaded."):
        super().__init__(message=message, status_code=503)


class InvalidImageException(AIServiceException):
    def __init__(self, message: str = "The provided image is invalid or unreadable."):
        super().__init__(message=message, status_code=400)


async def global_exception_handler(request: Request, exc: AIServiceException):
    logger.error(f"Error handling request {request.method} {request.url}: {exc.message}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.message, "status": "error"}
    )

class ModelRegistryException(AIServiceException):
    """Base exception for Model Registry"""
    def __init__(self, message: str, status_code: int = 500):
        super().__init__(message=message, status_code=status_code)

class ModelAlreadyExistsException(ModelRegistryException):
    def __init__(self, model_id: str):
        super().__init__(message=f"Model with ID '{model_id}' is already registered.", status_code=409)

class ModelNotFoundException(ModelRegistryException):
    def __init__(self, model_id: str):
        super().__init__(message=f"Model with ID '{model_id}' not found in registry.", status_code=404)

class InvalidMetadataException(ModelRegistryException):
    def __init__(self, message: str = "Invalid model metadata provided."):
        super().__init__(message=message, status_code=400)

class ModelLoadException(AIServiceException):
    def __init__(self, model_id: str, detail: str = ""):
        super().__init__(message=f"Failed to load model '{model_id}'. {detail}", status_code=500)
