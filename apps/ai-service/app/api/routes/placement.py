import json
from dataclasses import asdict
from typing import Optional

from fastapi import APIRouter, File, Form, UploadFile, HTTPException
from app.ml.placement.result import FurnitureMetadata
from app.models.requests import ProductMetadata
from app.services.placement_service import PlacementService

router = APIRouter()
service = PlacementService()

@router.post("/placement")
async def placement(
    image: UploadFile = File(...),
    furniture_metadata: str = Form(...),
    available_products: Optional[str] = Form(None),
):
    try:
        # Parse furniture metadata JSON string
        furniture_dict = json.loads(furniture_metadata)
        # Using dictionary unpacking to instantiate the dataclass
        furniture = FurnitureMetadata(**furniture_dict)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid furniture_metadata format: {e}")

    candidates = None
    if available_products:
        try:
            candidates_list = json.loads(available_products)
            candidates = [ProductMetadata(**p) for p in candidates_list]
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid available_products format: {e}")

    result = await service.evaluate(image, furniture, available_products=candidates)
    # The result is a dataclass; FastAPI will automatically convert it to a dict if we return it directly,
    # or we can use vars() / dataclasses.asdict()
    return asdict(result)
