import requests, json

payload = {
    "preferences": {
        "query": "i need to furnish my office",
        "category": None,
        "max_price": None,
        "material": None
    },
    "available_products": [
        {
            "productId": "p1",
            "name": "Baby High Chair",
            "category": "Living Room",
            "material": "Wood",
            "price": 15000,
            "stock": 10,
            "description": "Chair for baby"
        },
        {
            "productId": "p2",
            "name": "Office Desk",
            "category": "Office",
            "material": "Wood",
            "price": 50000,
            "stock": 5,
            "description": "Executive work desk for office"
        }
    ]
}

print("--- Testing Cloud Run (remote) ---")
try:
    r = requests.post("https://limata-ai-657932760235.asia-south1.run.app/recommend", json=payload, timeout=10)
    print("Status:", r.status_code)
    print("Response:", r.text)
except Exception as e:
    print("Remote failed:", e)

print("\n--- Testing Localhost:8000 ---")
try:
    r = requests.post("http://localhost:8000/recommend", json=payload, timeout=10)
    print("Status:", r.status_code)
    print("Response:", r.text)
except Exception as e:
    print("Local failed:", e)
