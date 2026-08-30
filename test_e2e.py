import requests
import json

print("Fetching a product from the API...")
try:
    res = requests.get("http://localhost:4000/api/products")
    data = res.json().get("data", [])
    if isinstance(data, dict):
        products = data.get("products", [])
    else:
        products = data
        
    if not products:
        print("Could not retrieve a product. Exiting.")
        exit(1)
        
    product = products[0]
    product_id = product["productId"]
    print(f"Using Product ID: {product_id} ({product.get('name')})")
    
    # Create a dummy image. 
    # Wait, YOLO and MiDaS might fail if the image isn't a valid JPEG/PNG.
    # Let's create a 1x1 real JPEG using PIL or just raw bytes of a tiny 1x1 png.
    tiny_png = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82'

    files = {
        "image": ("room.png", tiny_png, "image/png")
    }
    form_data = {
        "productId": product_id
    }
    
    print(f"Sending POST to http://localhost:4000/api/ai/placement...")
    response = requests.post("http://localhost:4000/api/ai/placement", files=files, data=form_data)
    
    print(f"Status Code: {response.status_code}")
    print("Response JSON:")
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(f"Error occurred: {e}")
