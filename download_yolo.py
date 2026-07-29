import os
from ultralytics import YOLO

os.makedirs('models/yolo', exist_ok=True)
print("Downloading yolov8n.pt...")
model = YOLO('yolov8n.pt')
# The file yolov8n.pt will be downloaded to the current directory.
# Move it to models/yolo/
if os.path.exists('yolov8n.pt'):
    os.replace('yolov8n.pt', 'models/yolo/yolov8n.pt')
    print("Moved to models/yolo/yolov8n.pt")
else:
    print("Could not find downloaded file.")
