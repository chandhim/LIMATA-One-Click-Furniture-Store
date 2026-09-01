# LIMATA AI MODULE ANALYSIS & ARCHITECTURE

## EXECUTIVE SUMMARY

A comprehensive inspection of the LIMATA codebase reveals that the AI Module (`apps/ai-service`) is currently in a **scaffolded/placeholder state**. While the overarching project architecture allocates a dedicated microservice for AI capabilities, the advanced features (YOLO, MiDaS, Spatial Analysis, Recommendation Engine) have not yet been implemented in the codebase.

The analysis below documents the *actual* current state of the repository and provides an architectural blueprint for future development.

---

## 1. AI DIRECTORY ANALYSIS

The only AI-related directory currently present in the monorepo is `apps/ai-service/`. 

```text
apps/ai-service/
├── .venv/               # Local Python virtual environment
├── app/
│   ├── __pycache__/     # Compiled Python bytecode cache
│   └── main.py          # Entry point for the FastAPI application
├── Python/              # Local Python execution binaries/environment (Windows-specific)
├── .env.example         # Environment variable template
├── .gitignore           # Git ignore rules for the AI service
├── package.json         # Node.js wrapper for monorepo script execution (Turborepo compatibility)
├── package-lock.json    # NPM lockfile
└── requirements.txt     # Python dependencies list
```

### Directory Purposes
* **`app/`**: Intended to house the core FastAPI application logic, routes, and services. Currently only contains the scaffolding.
* **`.venv/` / `Python/`**: Local Python execution environments used for running the service in development.

*(Note: Directories for `models/`, `weights/`, `datasets/`, `scripts/`, `training/`, `inference/`, and `docker/` are completely absent from the current codebase.)*

---

## 2. AI FILE ANALYSIS

### `apps/ai-service/app/main.py`
* **Purpose:** Initializes the FastAPI application.
* **Inputs:** None (currently receives HTTP GET on `/health`).
* **Outputs:** JSON health check payload.
* **Dependencies:** `FastAPI` from the `fastapi` library.
* **Modules Calling It:** Exposed to the Turborepo dev script, meant to be called by the Node.js API (`apps/api`) or reverse proxy.

### `apps/ai-service/requirements.txt`
* **Purpose:** Defines the Python packages required to run the service.
* **Contents:**
  * `fastapi==0.121.1`
  * `uvicorn[standard]==0.38.0`
* **Dependencies:** Lists only the web framework and ASGI server. Computer Vision/ML libraries are not yet defined.

*(Note: YOLO scripts, MiDaS configurations, and dataset utilities do not exist in the repository.)*

---

## 3. CURRENT AI ARCHITECTURE

Based on the actual implementation, the current architecture is limited to:

```text
Turborepo Start Script
          ↓
   Uvicorn Server
          ↓
  FastAPI (main.py)
          ↓
    /health Route
```

### Planned AI Architecture (Future State)
Based on the monorepo structure and the user's intended design, the final architecture should look like this:

```text
Frontend (React/Three.js)
          ↓
Backend API (Express.js)
          ↓
FastAPI (AI Microservice)
          ↓
Python Services (Inference Engine)
   ├── YOLO (Object Detection)
   └── MiDaS (Depth Estimation)
          ↓
Results Aggregation (Spatial Analysis)
          ↓
Response to Backend (Express.js)
          ↓
Frontend (React/Three.js)
```

---

## 4. FASTAPI ANALYSIS

**Current Endpoints:**

1. **`GET /health`**
   * **Purpose:** Verifies that the AI microservice is running and accessible.
   * **Request Model:** None.
   * **Response Model:** `dict[str, str]` -> `{"status": "ok", "service": "ai-service"}`
   * **Services/Startup Logic:** Standard FastAPI instantiation (`app = FastAPI(title="LIMATA AI Service")`). No complex startup events or model loading logic exists yet.

---

## 5. MODEL ANALYSIS

* **YOLO Models:** None present in the codebase.
* **MiDaS Models:** None present in the codebase.
* **Other Models:** None present.
* **Implementation Status:** ❌ Not Implemented. The model loading process, inference pipeline, and weights files have not been added to the repository.

---

## 6. DATA FLOW

### Current Data Flow:
```text
HTTP GET /health -> FastAPI -> JSON Response {"status": "ok"}
```

### Planned Data Flow (For Spatial/AR Analysis):
```text
Image Upload from Web Client
          ↓
Express.js Backend (S3 Storage)
          ↓
HTTP POST Image URL to FastAPI
          ↓
YOLO Detection (Bounding boxes of existing furniture)
          ↓
Depth Estimation (MiDaS mapping)
          ↓
Spatial Analysis (Calculating room scale and available placement space)
          ↓
JSON Response (Coordinates and scale data)
          ↓
Express.js Backend
          ↓
Frontend (Renders 3D object in AR at calculated coordinates)
```

---

## 7. VIRTUAL MACHINE / AI ENVIRONMENT ANALYSIS

* **Python Virtual Environment:** The codebase utilizes a local `.venv` (and a custom `Python/` folder likely specific to a local Windows environment).
* **Docker:** No Dockerfile or `docker-compose.yml` is present for the AI service. 
* **Required Python Version:** Not explicitly locked in a `.python-version` file, but standard practice dictates Python 3.10+ for modern FastAPI/PyTorch setups.
* **Startup Commands:** Managed by Turborepo (`npm run dev` or `pnpm run dev`), which likely proxies to `uvicorn app.main:app --reload`.

---

## 8. DEPENDENCIES

**Current Dependencies (`requirements.txt`):**
* **FastAPI:** The web framework for building APIs.
* **Uvicorn:** The ASGI web server implementation for Python.

**Missing Dependencies (Required for future implementation):**
* **Ultralytics (YOLO):** Missing. Required for object detection.
* **PyTorch (`torch`, `torchvision`):** Missing. Required to run MiDaS and YOLO.
* **OpenCV (`opencv-python`):** Missing. Required for image processing and matrix transformations.
* **NumPy / Pillow:** Missing. Required for array manipulation and image loading.
* **Transformers (HuggingFace):** Missing. Potentially required if using MiDaS via the transformers library.

---

## 9. CURRENT IMPLEMENTATION STATUS

| Module / Feature | Status |
| :--- | :--- |
| FastAPI Server | ✅ (Basic Scaffolding) |
| YOLO Integration | ❌ |
| MiDaS Integration | ❌ |
| Spatial Analysis | ❌ |
| Recommendation Engine | ❌ |
| Chatbot | ❌ |

---

## 10. FUTURE AI IMPLEMENTATION PLAN

Based on the current scaffolded state, here are the architectural recommendations for a developer to continue the AI implementation:

### 1. Better Folder Organization
Restructure `apps/ai-service/app/` to support a scalable ML architecture:
```text
apps/ai-service/
├── app/
│   ├── api/             # FastAPI routers/endpoints
│   ├── core/            # Configuration and startup events
│   ├── models/          # Pydantic request/response models
│   ├── ml/              # Machine learning inference logic
│   │   ├── yolo.py
│   │   ├── midas.py
│   │   └── spatial.py
│   └── utils/           # Image processing tools
├── weights/             # Downloaded .pt or .onnx model files (GIT IGNORED)
├── Dockerfile           # Containerization for production deployment
└── requirements.txt     # Updated dependencies
```

### 2. Next Implementation Priorities
1. **Dockerize the Environment:** AI dependencies (PyTorch, OpenCV) are notoriously difficult to manage across different operating systems. Create a `Dockerfile` immediately to ensure environment parity.
2. **Implement Model Loading on Startup:** Modify `main.py` to utilize FastAPI lifespan events to load YOLO and MiDaS models into GPU/CPU memory once when the server starts, rather than per request.
3. **Build the Inference Pipeline:** Create a service class that takes an image, runs YOLO for bounding boxes, generates a MiDaS depth map, and calculates physical spatial coordinates.

### 3. Integration Points with Backend (Express.js)
* Update the Node.js API (`apps/api`) to securely call the FastAPI service internally (preventing direct internet exposure of the AI endpoints).
* Define strict TypeScript interfaces in `@limata/types` that perfectly match the Pydantic response models defined in FastAPI.

### 4. Integration Points with Frontend (React)
* The frontend should not communicate with FastAPI directly. It should upload images to the Express.js backend, which proxies the AI data and returns the spatial coordinates required by the `@react-three/fiber` AR viewer to accurately place furniture.
