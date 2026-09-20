from app.core.exceptions import NotImplementedException


def save_temp_file(file_content: bytes, suffix: str = ".jpg") -> str:
    """
    Scaffolding for saving temporary files for model inference.
    """
    raise NotImplementedException("File handling utility is not implemented yet.")


def cleanup_temp_file(file_path: str):
    """
    Scaffolding for temporary file cleanup.
    """
    raise NotImplementedException("File cleanup utility is not implemented yet.")
