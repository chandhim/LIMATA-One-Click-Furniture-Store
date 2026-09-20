import requests
import json
import base64

BASE_URL = "http://localhost:8001"

results = {}

tiny_png = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82'
dummy_payload_image_url = {"image_url": "https://picsum.photos/400"}

def run_test(name, method, endpoint, **kwargs):
    print(f"Testing {name} -> {method} {endpoint}...")
    try:
        url = BASE_URL + endpoint
        if method == "GET":
            res = requests.get(url, timeout=30)
        else:
            res = requests.post(url, timeout=30, **kwargs)
        
        status = res.status_code
        try:
            data = res.json()
        except:
            data = res.text
            
        if status < 400:
            print(f"[OK] {name}: {status}")
            results[name] = {"status": "success", "code": status, "data": str(data)[:300]}
        else:
            print(f"[FAIL] {name} failed: {status}")
            results[name] = {"status": "error", "code": status, "error": str(data)}
    except Exception as e:
        print(f"[FAIL] {name} exception: {e}")
        results[name] = {"status": "exception", "error": str(e)}

# 1. /health
run_test("Health", "GET", "/health")

# 2. /detect (YOLO)
run_test("Detection", "POST", "/detect", json=dummy_payload_image_url)

# 3. /depth (MiDaS)
run_test("Depth", "POST", "/depth", json=dummy_payload_image_url)

# 4. /analyze
run_test("Spatial Analysis", "POST", "/analyze", json=dummy_payload_image_url)

# 5. /recommend
rec_payload = {
    "preferences": {"query": "sofa", "max_price": 5000},
    "available_products": [{"productId": "1", "name": "sofa", "description": "nice", "category": "Living Room", "price": 100, "stock": 10}]
}
run_test("Recommendation", "POST", "/recommend", json=rec_payload)

# 6. /chat
chat_payload = {
    "message": "hello",
    "context": {"available_products": []},
    "history": []
}
run_test("Chatbot", "POST", "/chat", json=chat_payload)

# 7. /placement
placement_files = {"image": ("test.png", tiny_png, "image/png")}
placement_data = {"furniture_metadata": json.dumps({"width": 1, "depth": 1, "height": 1, "category": "Living Room", "rotatable": True})}
run_test("Placement", "POST", "/placement", files=placement_files, data=placement_data)

# 8. /visual-recommend
visual_files = {"image": ("test.png", tiny_png, "image/png")}
visual_data = {"available_products": json.dumps([{"productId": "1", "name": "sofa", "description": "nice", "category": "Living Room", "price": 100, "stock": 10}])}
run_test("Visual Recommend", "POST", "/visual-recommend", files=visual_files, data=visual_data)

print("\n--- RESULTS ---")
print(json.dumps(results, indent=2))
