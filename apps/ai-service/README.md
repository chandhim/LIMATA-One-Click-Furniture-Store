# LIMATA AI Service

This is the FastAPI microservice responsible for handling all AI and Machine Learning capabilities for the LIMATA platform. It follows Clean Architecture principles to ensure scalability and maintainability.

## Architecture Overview
The service is structured as follows:
- **`app/api/`**: Contains the route definitions and centralized API router.
- **`app/core/`**: Houses global configurations, centralized logging, and custom exception handling.
- **`app/models/`**: Defines Pydantic schemas for request and response validation.
- **`app/services/`**: The core business logic layer. Defines public interfaces for ML capabilities.
- **`app/ml/`**: Manages the lifecycle, loading, and registry of ML models.
- **`app/utils/`**: Reusable utilities for image, file, and validation processing.
- **`weights/`**: Directory for storing heavy `.pt` or `.onnx` model weights (excluded from version control).

## Startup Instructions

### Local Development (Using Existing Virtual Environment)
The project is configured to use the existing `.venv` or `Python` directory for local development. These directories are ignored by Git.

1. Activate your local virtual environment:
   ```bash
   # Windows
   .venv\Scripts\activate
   # macOS/Linux
   source .venv/bin/activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the development server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Docker Usage
A `Dockerfile` and `docker-compose.yml` are provided for containerized deployment.

1. Build and start the container:
   ```bash
   docker-compose up --build
   ```
2. The service will be available at `http://localhost:8000`.

## Future AI Integration Roadmap
This architecture is specifically scaffolded to support the future implementation of:
1. **YOLOv8** for object detection (`DetectionService`).
2. **MiDaS** for depth estimation (`DepthService`).
3. **Spatial Suitability Analysis** (`SpatialService`).
4. **Context-Aware Recommendations** (`RecommendationService`).
5. **AI Chatbot** (`ChatbotService`).

Currently, all endpoints except `GET /health` return `501 Not Implemented`. Once dependencies like `torch`, `torchvision`, and `ultralytics` are added, the service implementations can be built out without structural changes.
