import logging
import sys
from .config import settings


def setup_logging():
    log_level = getattr(logging, settings.log_level.upper(), logging.INFO)
    
    # Configure root logger
    logging.basicConfig(
        level=log_level,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        handlers=[
            logging.StreamHandler(sys.stdout),
            # File logging can be added here
            # logging.FileHandler("ai_service.log")
        ]
    )

    logger = logging.getLogger(settings.app_name)
    logger.info("Logging configured.")
    return logger

logger = logging.getLogger(settings.app_name)
