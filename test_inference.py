import requests
import json

print("Testing visual-recommend...")
res1 = requests.post(
    'http://localhost:8080/visual-recommend', 
    files={'image': open('evaluation/images/01_living_sofa.jpg', 'rb')}, 
    data={'available_products': '[]'}
)
print("Status:", res1.status_code)
print(res1.json())

print("Testing placement...")
res2 = requests.post(
    'http://localhost:8080/placement', 
    files={'image': open('evaluation/images/01_living_sofa.jpg', 'rb')}, 
    data={'furniture_metadata': json.dumps({'category':'couch', 'width': 1, 'height': 1, 'depth': 1})}
)
print("Status:", res2.status_code)
print(res2.json())
