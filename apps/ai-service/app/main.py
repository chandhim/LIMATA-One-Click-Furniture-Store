from fastapi import FastAPI
from app.api.router import api_router
from app.core.config import settings
from app.core.logging import setup_logging
from app.core.exceptions import AIServiceException, global_exception_handler

# Initialize centralized logging
logger = setup_logging()

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    debug=settings.debug
)

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
