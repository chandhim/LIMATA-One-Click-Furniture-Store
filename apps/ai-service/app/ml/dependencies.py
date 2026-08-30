from .registry import registry
from .model_loader import ModelLoader

# One application-wide ModelLoader instance
global_loader = ModelLoader(registry)

def get_model_loader() -> ModelLoader:
    """
    Dependency provider for FastAPI or direct import for services
    to ensure a single, shared ModelLoader instance is used globally.
    """
    return global_loader
