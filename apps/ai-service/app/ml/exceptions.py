class AIException(Exception):
    """
    Base exception for all AI subsystem errors.
    """
    pass

class ModelLoadException(AIException):
    """
    Raised when an error occurs during the loading of an AI model into memory.
    """
    pass

class AIInferenceException(AIException):
    """
    Raised when an error occurs during model inference.
    """
    pass

class UnsupportedModelException(AIException):
    """
    Raised when an orchestrated model is not supported or not configured correctly.
    """
    pass
