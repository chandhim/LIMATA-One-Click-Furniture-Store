import json
from fastapi import APIRouter, File, Form, UploadFile, HTTPException
from app.ml.placement.result import FurnitureMetadata
from app.services.placement_service import PlacementService

router = APIRouter()
service = PlacementService()

@router.post("/placement")
async def placement(
    image: UploadFile = File(...),
    furniture_metadata: str = Form(...)
):
    try:
        # Parse furniture metadata JSON string
        furniture_dict = json.loads(furniture_metadata)
        # Using dictionary unpacking to instantiate the dataclass
        furniture = FurnitureMetadata(**furniture_dict)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid furniture_metadata format: {e}")
        
    result = await service.evaluate(image, furniture)
    # The result is a dataclass; FastAPI will automatically convert it to a dict if we return it directly,
    # or we can use vars() / dataclasses.asdict()
    from dataclasses import asdict
    return asdict(result)
