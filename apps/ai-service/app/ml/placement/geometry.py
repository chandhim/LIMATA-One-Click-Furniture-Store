from app.ml.bounding_box import BoundingBox

def calculate_bbox_area(bbox: BoundingBox) -> float:
    """
    Calculates the 2D pixel area of a bounding box.
    """
    width = max(0.0, bbox.x2 - bbox.x1)
    height = max(0.0, bbox.y2 - bbox.y1)
    return width * height

def get_total_image_area(width: int, height: int) -> float:
    """
    Returns the total area of the image in pixels.
    """
    return float(width * height)
