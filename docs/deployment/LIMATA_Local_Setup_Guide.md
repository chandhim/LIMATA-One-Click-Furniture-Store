# LIMATA Local Development Setup Guide (A to Z)

Welcome to the LIMATA project! This guide will walk you through the A-to-Z process of setting up the complete LIMATA platform locally on your computer, including the Node.js apps and the newly implemented Python AI service.

## 1. System Prerequisites

Before starting, please ensure you have the following installed on your machine:
- **Git**: For version control.
- **Node.js**: v24.x (use `nvm install 24` or `fnm use` to match `.nvmrc`).
- **pnpm**: v10.x (`npm install -g pnpm` to install globally).
- **Python**: v3.11.x (Required for the AI microservice).
- **PostgreSQL**: A local PostgreSQL database instance (or a dockerized Postgres DB).

*(Note: Docker is only required for deployment testing, not for local development).*

## 2. Pulling the Repository

First, clone the repository from GitHub and navigate into the project folder.

```bash
git clone <repository-url>
cd LIMATA-One-Click-Furniture-Store
```

*(Optional) If you have already cloned it in the past, simply pull the latest changes:*
```bash
git pull origin main
```

## 3. Environment Variables & Database Setup

1. **Copy Environment Variables:**
   Copy the provided `.env.example` file to create your local `.env` file.
   ```bash
   cp .env.example .env
   ```
2. **Configure Database URL:**
   Open the `.env` file and update the `DATABASE_URL` and `DIRECT_URL` to match your local PostgreSQL credentials. For example:
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/limata"
   ```
3. **Database Migration:**
   Once your PostgreSQL server is running and the database `limata` exists, run the Prisma schema push/migrations to create the necessary tables.
   *(Since this is a monorepo, we'll run the installation in the next step first).*

## 4. Install Node Dependencies

We use `pnpm` workspaces to manage the frontend (`apps/web`) and backend API (`apps/api`).

From the **project root**, install all Node dependencies:
```bash
pnpm install
```

After installation, run the Prisma generation and migration:
```bash
pnpm run prisma:generate
pnpm run prisma:migrate
```

## 5. Python AI Service Setup

The AI microservice handles the machine learning capabilities (YOLOv8, MiDaS, etc.) and runs in an isolated Python environment inside `apps/ai-service`.

1. **Navigate to the AI service folder:**
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
   *(Note: The `.venv` folder is excluded via `.gitignore`, please do not commit it).*

5. **Download the AI Models:**
   Return to the **project root folder** (with your `.venv` still activated or use your local python environment if you have `ultralytics` installed) and run the scripts to download the YOLOv8 and MiDaS models:
   ```bash
   cd ../../
   # Make sure you are in the root: LIMATA-One-Click-Furniture-Store
   # Install ultralytics globally or in your venv if not already present to download models
   python scripts/utilities/download_yolo.py
   python download_midas.py
   ```
   This will download the `yolov8n.pt` and `dpt_hybrid-midas-xxxxxxxx.pt` files and place them in the `models/yolo` and `models/midas` directories.

## 6. Running the Application Locally

You can start the different services in separate terminal windows, or run them concurrently using turbo.

### Option A: The Easy Way (Run All Services Concurrently)
From the project root, simply run:
```bash
pnpm run dev
```
*(This command will use Turbo to concurrently start the Next.js frontend, Express API backend, and the FastAPI AI service).*

### Option B: Run Services Individually (for debugging)
Open three separate terminal windows:

1. **Backend API (Express)**
   ```bash
   # Terminal 1 - Project root
   pnpm --filter api run dev
   ```
2. **Frontend (Next.js)**
   ```bash
   # Terminal 2 - Project root
   pnpm --filter web run dev
   ```
3. **AI Service (FastAPI)**
   ```bash
   # Terminal 3 - Inside apps/ai-service
   # Ensure your .venv is activated!
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

## 7. Health Verification

To verify that your entire environment is running correctly:

1. **Frontend**: Open [http://localhost:3000](http://localhost:3000) in your browser.
2. **Backend API**: Send a request to `http://localhost:4000` to verify Express is listening.
3. **AI Service**: Open [http://localhost:8000/docs](http://localhost:8000/docs) to see the FastAPI Swagger UI and ensure the AI models loaded correctly.

## 8. Common Troubleshooting

- **Node version mismatch**: Ensure you are using Node 24 by running `node -v`. Use `nvm use` to switch.
- **Python virtual environment not found**: If pip installs fail globally, make sure your terminal prompt shows `(.venv)` to indicate the environment is active.
- **Port conflicts**: If ports `8000`, `4000`, or `3000` are already in use, update the `.env` file and restart the respective service.
- **Model downloading errors**: If `download_yolo.py` fails, ensure you have the `ultralytics` pip package installed (`pip install ultralytics`).

Happy coding!
