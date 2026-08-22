from app.core.exceptions import InvalidImageException


def validate_image_upload(content_type: str, file_size: int, max_size: int):
    """
    Scaffolding for validating uploaded files (size, type).
    """
    if file_size > max_size:
        raise InvalidImageException("File size exceeds maximum allowed limit.")
    
    allowed_types = ["image/jpeg", "image/png", "image/webp"]
    if content_type not in allowed_types:
        raise InvalidImageException(f"Invalid content type. Allowed: {', '.join(allowed_types)}")
    
    return True
