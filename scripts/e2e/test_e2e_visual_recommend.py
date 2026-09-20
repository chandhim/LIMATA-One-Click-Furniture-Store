import requests
import json

print("Fetching a product from the API...")
try:
    tiny_png = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82'

    # Authenticate
    print("Registering dummy user to get token...")
    import time
    auth_data = {
        "email": f"testvisualrec_{int(time.time())}@example.com",
        "password": "Password123!",
        "name": "Test User"
    }
    auth_res = requests.post("http://localhost:4000/api/auth/register", json=auth_data)
    if auth_res.status_code == 400: # Already exists
        auth_res = requests.post("http://localhost:4000/api/auth/login", json={"email": auth_data["email"], "password": auth_data["password"]})
    
    auth_json = auth_res.json()
    if "data" not in auth_json:
        print(f"Auth failed: {auth_json}")
        exit(1)
    token = auth_json["data"]["token"]
    headers = {"Authorization": f"Bearer {token}"}

    files = {
        "image": ("room.png", tiny_png, "image/png")
    }
    
    print(f"Sending POST to http://localhost:4000/api/ai/visual-recommend...")
    response = requests.post("http://localhost:4000/api/ai/visual-recommend", headers=headers, files=files)
    
    print(f"Status Code: {response.status_code}")
    print("Response JSON:")
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(f"Error occurred: {e}")
