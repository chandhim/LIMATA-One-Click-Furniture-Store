from pydantic import BaseModel, Field
from typing import Any
from datetime import datetime
from .metadata import DeviceType

class RuntimeState(BaseModel):
    """
    Represents the runtime state of a loaded model.
    This is kept independent of the metadata registry.
    """
    model_id: str = Field(..., description="The ID of the loaded model")
    instance: Any = Field(..., description="The actual model instance (e.g., PyTorch model)")
    device: DeviceType = Field(..., description="The device the model is loaded on")
    loaded_at: datetime = Field(default_factory=datetime.utcnow, description="When the model was loaded")
    
    class Config:
        arbitrary_types_allowed = True
