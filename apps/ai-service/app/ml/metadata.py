from enum import Enum
from typing import List
from pydantic import BaseModel, Field

class ModelStatus(str, Enum):
    REGISTERED = "registered"
    LOADING = "loading"
    READY = "ready"
    FAILED = "failed"
    UNLOADED = "unloaded"

class DeviceType(str, Enum):
    CPU = "cpu"
    GPU = "gpu"
    MPS = "mps"

class ModelMetadata(BaseModel):
    model_id: str = Field(..., description="Unique identifier for the model")
    display_name: str = Field(..., description="Human readable name")
    task_type: str = Field(..., description="Type of AI task (e.g., Object Detection, Depth Estimation)")
    version: str = Field(..., description="Model version")
    status: ModelStatus = Field(default=ModelStatus.REGISTERED, description="Current status of the model")
    supported_devices: List[DeviceType] = Field(default_factory=lambda: [DeviceType.CPU], description="Devices supported by this model")
    expected_input_type: str = Field(..., description="Type of input the model expects (e.g., Image, Text, Tensor)")
    expected_output_type: str = Field(..., description="Type of output the model returns")
    weights_path: str = Field(default="", description="Path to the model weights file")
