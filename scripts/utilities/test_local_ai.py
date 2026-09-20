import requests
import json

BASE_URL = "http://localhost:8001"

dummy_payload_image_url = {"image_url": "https://picsum.photos/400"}

def test_endpoint(name, method, endpoint, **kwargs):
    print(f"Testing {name} -> {method} {endpoint}...")
    try:
        if method == "GET":
            res = requests.get(BASE_URL + endpoint, timeout=60)
        else:
            res = requests.post(BASE_URL + endpoint, timeout=60, **kwargs)
        print(f"[{res.status_code}] {res.json()}")
    except Exception as e:
        print(f"[ERROR] {e}")

test_endpoint("Detection", "POST", "/detect", json=dummy_payload_image_url)
test_endpoint("Depth", "POST", "/depth", json=dummy_payload_image_url)
test_endpoint("Spatial Analysis", "POST", "/analyze", json=dummy_payload_image_url)
