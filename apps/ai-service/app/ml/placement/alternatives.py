from typing import Any, Dict, List, Optional, Type

from app.ml.spatial.result import SpatialAnalysisResult
from app.ml.placement.result import FurnitureMetadata
from app.ml.placement.compatibility import evaluate_dimensional_fit
from app.ml.placement.config import PlacementConfig
from app.models.requests import ProductMetadata


def rank_spatial_alternatives(
    spatial_result: SpatialAnalysisResult,
    primary_furniture: FurnitureMetadata,
    candidates: List[ProductMetadata],
    image_width: int,
    image_height: int,
    config: Type[PlacementConfig] = PlacementConfig,
    limit: Optional[int] = None,
) -> List[Dict[str, Any]]:
    """
    Given a primary furniture item that did not fit the estimated available space,
    ranks same-category candidate products that DO fit, reusing the exact same
    `evaluate_dimensional_fit` heuristic already run for the primary item against the
    SAME spatial_result (no additional YOLO/MiDaS inference is performed).

    Candidates preferred are those closest in footprint to the original — "sufficiently
    smaller to fit", not the smallest item available — so the suggestion stays relevant
    to what the shopper originally wanted.

    Candidates without recorded width/depth are always skipped: this function never
    asserts spatial suitability for a product it cannot actually measure. Such
    candidates are left for the existing generic (text/category) recommendation flow
    to handle, if applicable — they are not silently promoted here.
    """
    if limit is None:
        limit = config.MAX_ALTERNATIVE_RECOMMENDATIONS

    fitting: List[Dict[str, Any]] = []
    for candidate in candidates:
        if primary_furniture.category and candidate.category != primary_furniture.category:
            continue
        if candidate.width is None or candidate.depth is None:
            continue

        candidate_furniture = FurnitureMetadata(
            width=candidate.width,
            depth=candidate.depth,
            height=candidate.height,
            category=candidate.category,
            rotatable=True,
        )
        fit = evaluate_dimensional_fit(
            spatial_result, candidate_furniture, image_width, image_height, config
        )
        if fit.status != "FITS":
            continue

        footprint_cm2 = candidate.width * candidate.depth
        fitting.append(
            {
                "productId": candidate.productId,
                "reason": "Estimated to fit the available space based on its recorded dimensions.",
                "orientation": fit.details.get("orientation_used", "0°"),
                "footprint_cm2": round(footprint_cm2, 1),
            }
        )

    # Prefer the alternative closest in size to the original (largest footprint that
    # still fits), not the smallest possible item.
    fitting.sort(key=lambda c: c["footprint_cm2"], reverse=True)
    return fitting[:limit]
