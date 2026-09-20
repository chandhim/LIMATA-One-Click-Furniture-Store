# LIMATA Development Setup

Welcome to the LIMATA project! This guide will help you set up the development environment locally.

## 1. Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: v24.x (use `nvm install` or `fnm use` to match `.nvmrc`)
- **pnpm**: v10.x
- **Python**: v3.11.x
- **PostgreSQL**: Local instance or Docker container (optional for purely AI work if DB is not needed).
- **Git**

*Note: Docker is only required for deployment testing, not for local development.*

## 2. Initial Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd LIMATA-One-Click-Furniture-Store
   ```

2. **Environment Variables:**
   Copy `.env.example` to `.env` in the project root.
   ```bash
   cp .env.example .env
   ```
   Fill in the missing values in `.env` if necessary (e.g., local database credentials).

3. **Install Node Dependencies:**
   We use pnpm workspaces for the frontend and backend API.
   ```bash
   pnpm install
   ```

## 3. Python AI Service Setup

The AI microservice (`apps/ai-service`) runs in an isolated Python environment. 

1. **Navigate to the AI service:**
   ```bash
   cd apps/ai-service
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv .venv
   ```

3. **Activate the virtual environment:**
   - **Windows:** `.venv\Scripts\activate`
   - **macOS/Linux:** `source .venv/bin/activate`

4. **Install required packages:**
   ```bash
   pip install -r requirements.txt
   ```
   *(Note: Do NOT commit your `.venv` folder. It is excluded in `.gitignore`.)*

## 4. Running the Application Locally

You need to start the different services in separate terminal windows.

### A. Backend API (Express)
```bash
# In the project root
pnpm --filter api run dev
```

### B. Frontend (Next.js)
```bash
# In the project root
pnpm --filter web run dev
```

### C. AI Service (FastAPI)
```bash
# In apps/ai-service, with .venv activated
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## 5. Health Verification

To verify that your environment is running correctly:

1. **Frontend**: Open `http://localhost:3000` in your browser.
2. **Backend API**: Open `http://localhost:4000/health` (assuming a health endpoint exists).
3. **AI Service**: Open `http://localhost:8000/health` or `http://localhost:8000/docs` to see the FastAPI Swagger UI.
4. **Communication Check**: Perform an action in the frontend that triggers an AI request (or ping the Express API route that proxies to FastAPI) to ensure Express ↔ FastAPI communication works.

## 6. Common Troubleshooting

- **Node version mismatch**: Ensure you are using Node 24 by running `node -v`. Use `nvm use` to switch.
- **Python virtual environment not found**: If pip installs fail globally, make sure your terminal prompt shows `(.venv)` to indicate the environment is active.
- **Port conflicts**: If `8000`, `4000`, or `3000` are already in use, update the `.env` file and restart the respective service.

Happy coding!
