FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libgl1 libglib2.0-0 git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Pre-install CPU-only PyTorch to avoid massive CUDA dependencies
RUN pip install --no-cache-dir torch torchvision --index-url https://download.pytorch.org/whl/cpu \
    && pip install --no-cache-dir -r requirements.txt

COPY . .

RUN yes | python download_midas.py

RUN python -c "import os; from ultralytics import YOLO; YOLO(os.path.abspath('models/yolo/yolov8n.pt'))"

EXPOSE 8000

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
