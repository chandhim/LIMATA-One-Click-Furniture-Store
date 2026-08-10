from fastapi import FastAPI
from app.api.router import api_router
from app.core.config import settings
from app.core.logging import setup_logging
from app.core.exceptions import AIServiceException, global_exception_handler
from app.ml.registry import registry
from app.ml.metadata import ModelMetadata
from app.ml.constants import ModelNames
import os

# Initialize centralized logging
logger = setup_logging()

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    debug=settings.debug
)

@app.on_event("startup")
async def startup_event():
    # Register YOLO if not exists
    if not registry.exists(ModelNames.YOLO):
        yolo_metadata = ModelMetadata(
            model_id=ModelNames.YOLO,
            display_name="YOLOv8 Nano",
            task_type="Object Detection",
            version="v8.0",
            expected_input_type="Image",
            expected_output_type="DetectionResult",
            weights_path=os.path.abspath("models/yolo/yolov8n.pt")
        )
        registry.register(yolo_metadata)
    
    # Register MiDaS if not exists
    if not registry.exists(ModelNames.MIDAS):
        midas_metadata = ModelMetadata(
            model_id=ModelNames.MIDAS,
            display_name="MiDaS Small v2.1",
            task_type="Depth Estimation",
            version="v2.1",
            expected_input_type="Image",
            expected_output_type="DepthResult",
            weights_path="models/midas/checkpoints/midas_v21_small_256.pt"
        )
        registry.register(midas_metadata)

# Register global exception handler
app.add_exception_handler(AIServiceException, global_exception_handler)

# Include all API routes
app.include_router(api_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug
    )
