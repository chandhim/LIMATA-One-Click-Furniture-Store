import os
import time
import csv
import requests

# Expected dataset
EXPECTED_IMAGES = [
    "01_living_sofa.jpg",
    "02_living_tv.jpg",
    "03_living_sofa_tv.jpg",
    "04_person_only.jpg",
    "05_empty_room.jpg",
    "06_bedroom_bed.jpg",
    "07_bedroom_bed_wardrobe.jpg",
    "08_bedroom_unrelated.jpg",
    "09_dining_table.jpg",
    "10_dining_table_chairs.jpg",
    "11_multiple_furniture.jpg",
    "12_blurry_room.jpg",
    "13_cluttered_room.jpg",
    "14_unusual_viewpoint.jpg",
    "15_extreme_lighting.jpg"
]

IMAGES_DIR = "evaluation/images"
RESULTS_DIR = "evaluation/results"
EXPRESS_API_URL = "http://localhost:4000/api"

# Will be populated with actual IDs
PRODUCT_WITH_DIMS = "cmqnju4670006ud6cpdni1ij9" # Office Chair
PRODUCT_WITHOUT_DIMS = "cmqko6doz0017sn8o438qdkfx"

def get_auth_token():
    auth_data = {
        "email": f"evaluator_{int(time.time())}@example.com",
        "password": "Password123!",
        "name": "Evaluator"
    }
    res = requests.post(f"{EXPRESS_API_URL}/auth/register", json=auth_data)
    if res.status_code == 400:
        res = requests.post(f"{EXPRESS_API_URL}/auth/login", json={"email": auth_data["email"], "password": auth_data["password"]})
    
    return res.json()["data"]["token"]

def main():
    print("Starting AI Evaluation Harness...")
    missing_images = [img for img in EXPECTED_IMAGES if not os.path.exists(os.path.join(IMAGES_DIR, img))]
    
    if missing_images:
        print("WARNING: The following images are missing from the evaluation dataset:")
        for mi in missing_images:
            print(f" - {mi}")
        print("Evaluation cannot proceed fully without the real dataset.")
        # We will continue anyway, it will just process whatever is present.
    
    available_images = [img for img in EXPECTED_IMAGES if img not in missing_images]
    if not available_images:
        print("No images found in images/. Please supply them manually.")
        return

    try:
        token = get_auth_token()
    except Exception as e:
        print(f"Authentication failed: {e}")
        return
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Visual Recommendation Evaluation
    vis_rec_results = []
    print("\n--- Running Visual Recommendation Evaluation ---")
    for img in available_images:
        img_path = os.path.join(IMAGES_DIR, img)
        with open(img_path, "rb") as f:
            files = {"image": (img, f, "image/jpeg")}
            start = time.perf_counter()
            res = requests.post(f"{EXPRESS_API_URL}/ai/visual-recommend", headers=headers, files=files)
            latency = int((time.perf_counter() - start) * 1000)
            
            data = res.json().get("data", {})
            visual_context = data.get("visual_context", {})
            vis_rec_results.append({
                "image": img,
                "status": res.status_code,
                "latency_ms": latency,
                "detected_class": visual_context.get("detected_class"),
                "confidence": visual_context.get("confidence"),
                "mapped_category": visual_context.get("mapped_category"),
                "search_query": visual_context.get("search_query"),
                "recommendation_count": len(data.get("recommendations", {})),
                "error": res.json().get("message") if res.status_code >= 400 else ""
            })
            print(f"Processed {img} - Status: {res.status_code} - Latency: {latency}ms")

    with open(os.path.join(RESULTS_DIR, "visual_recommendation_results.csv"), "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=vis_rec_results[0].keys() if vis_rec_results else [])
        writer.writeheader()
        writer.writerows(vis_rec_results)

    # 2. Placement Evaluation
    placement_results = []
    print("\n--- Running Placement Evaluation ---")
    for img in available_images:
        img_path = os.path.join(IMAGES_DIR, img)
        
        # With dims
        with open(img_path, "rb") as f:
            files = {"image": (img, f, "image/jpeg")}
            data = {"productId": PRODUCT_WITH_DIMS}
            start = time.perf_counter()
            res = requests.post(f"{EXPRESS_API_URL}/ai/placement", headers=headers, files=files, data=data)
            latency = int((time.perf_counter() - start) * 1000)
            
            d = res.json().get("data", {})
            placement_results.append({
                "image": img,
                "productId": PRODUCT_WITH_DIMS,
                "status": res.status_code,
                "latency_ms": latency,
                "suitable": d.get("suitable"),
                "evaluation_confidence": d.get("evaluation_confidence"),
                "estimated_clearance": d.get("estimated_clearance_cm"),
                "limiting_factor": d.get("limiting_factor"),
                "warnings": "|".join(d.get("warnings", []))
            })
            print(f"Processed {img} [With Dims] - Status: {res.status_code}")

        # Without dims
        with open(img_path, "rb") as f:
            files = {"image": (img, f, "image/jpeg")}
            data = {"productId": PRODUCT_WITHOUT_DIMS}
            start = time.perf_counter()
            res = requests.post(f"{EXPRESS_API_URL}/ai/placement", headers=headers, files=files, data=data)
            latency = int((time.perf_counter() - start) * 1000)
            
            d = res.json().get("data", {})
            placement_results.append({
                "image": img,
                "productId": PRODUCT_WITHOUT_DIMS,
                "status": res.status_code,
                "latency_ms": latency,
                "suitable": d.get("suitable"),
                "evaluation_confidence": d.get("evaluation_confidence"),
                "estimated_clearance": d.get("estimated_clearance_cm"),
                "limiting_factor": d.get("limiting_factor"),
                "warnings": "|".join(d.get("warnings", []))
            })
            print(f"Processed {img} [Without Dims] - Status: {res.status_code}")

    with open(os.path.join(RESULTS_DIR, "placement_results.csv"), "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=placement_results[0].keys() if placement_results else [])
        writer.writeheader()
        writer.writerows(placement_results)
        
    print("\nEvaluation harness complete. Results saved in results/")

if __name__ == "__main__":
    main()
