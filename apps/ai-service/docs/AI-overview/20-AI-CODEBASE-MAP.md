
# 20: AI Codebase Map

## System
FastAPI microservice running YOLO, MiDaS, Gemini API, and deterministic spatial heuristics for furniture placement.

## Entry Point
`app/main.py`

## Routes (`app/api/routes/`)
- `/health`, `/detect`, `/depth`, `/analyze`, `/placement`, `/recommend`, `/visual-recommend`, `/chat`

## Core (`app/core/`)
- `config.py`: Environment variables.
- `exceptions.py`: Custom HTTP errors.
- `logging.py`: Standard logging.
- `gemini_client.py`: LLM API wrapper.

## Registry & Loader (`app/ml/`)
- `registry.py`: Stores model metadata (ID, version, weights path).
- `model_loader.py`: Lazy-loads YOLO/MiDaS into RAM safely.
- `constants.py`: Model IDs.

## Orchestrator (`app/ml/`)
- `ai_orchestrator.py`: The boss. Calls models, passes raw tensors to `converters.py`, returns pure DTOs.

## Engines (`app/ml/spatial/`, `app/ml/placement/`)
- Pure Python deterministic logic. Calculates overlap, congestion, and relative depth. No neural networks here.

## Services (`app/services/`)
- Business logic. `DetectionService`, `SpatialService`, `ChatbotService`. They talk to FastAPI and the Orchestrator.

## Current Status
All API endpoints are implemented. YOLO, MiDaS, and Gemini are functional. Spatial placement relies on 2D heuristics, not 3D SLAM.

---

## DO NOT BREAK THESE RULES
1. **NEVER** import `torch` or `ultralytics` in the `services/` or `api/` directories.
2. **ALWAYS** use `converters.py` to translate raw model output into DTOs (`DetectionResult`, `DepthResult`) before returning from the Orchestrator.
3. **NEVER** instantiate models directly. Always use the `ModelLoader`.
4. **ALWAYS** use `cv2` or `numpy` for image passing between boundaries, never framework-specific tensors.
