import requests
import json
import os

BASE_URL = "http://localhost:8001"
TEST_IMAGE_URL = "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600"

def get_test_image_file():
    # Download the image to a temporary file
    if not os.path.exists("test_image.jpg"):
        resp = requests.get(TEST_IMAGE_URL)
        with open("test_image.jpg", "wb") as f:
            f.write(resp.content)
    return open("test_image.jpg", "rb")

def print_result(name, res):
    print(f"\n--- {name} ---")
    print(f"Status: {res.status_code}")
    if res.status_code == 200:
        if "depth" in name:
            data = res.json()
            # Truncate depth map url
            data["depth_map_url"] = data["depth_map_url"][:50] + "..."
            print("Response:", json.dumps(data, indent=2))
        else:
            print("Response:", json.dumps(res.json(), indent=2))
    else:
        print("Response:", res.text)

def run_tests():
    try:
        # 1. /detect
        res = requests.post(f"{BASE_URL}/detect", json={"image_url": TEST_IMAGE_URL})
        print_result("POST /detect", res)

        # 2. /depth
        res = requests.post(f"{BASE_URL}/depth", json={"image_url": TEST_IMAGE_URL})
        print_result("POST /depth", res)

        # 3. /analyze
        res = requests.post(f"{BASE_URL}/analyze", json={"image_url": TEST_IMAGE_URL})
        print_result("POST /analyze", res)

        # 4. /placement
        with get_test_image_file() as img:
            res = requests.post(
                f"{BASE_URL}/placement",
                files={"image": ("test_image.jpg", img, "image/jpeg")},
                data={"furniture_metadata": json.dumps({"category": "chair", "width": 50, "depth": 50, "height": 90})}
            )
            print_result("POST /placement", res)

        # 5. /visual-recommend
        with get_test_image_file() as img:
            res = requests.post(
                f"{BASE_URL}/visual-recommend",
                files={"image": ("test_image.jpg", img, "image/jpeg")},
                data={"available_products": json.dumps([{"productId": "1", "name": "modern chair", "description": "desc", "category": "chair", "price": 100, "stock": 10}])}
            )
            print_result("POST /visual-recommend", res)

        # 6. /recommend
        res = requests.post(f"{BASE_URL}/recommend", json={"user_id": "test", "session_id": "123", "query": "modern chair"})
        print_result("POST /recommend", res)

        # 7. /chat
        res = requests.post(f"{BASE_URL}/chat", json={"message": "hello", "session_id": "123"})
        print_result("POST /chat", res)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    run_tests()
