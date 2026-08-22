# LIMATA AI Baseline Evaluation Harness

This directory contains the tools and outputs required for a baseline evaluation of the LIMATA AI subsystem using real room images.

## 1. Dataset Scenarios & Image Filenames
To run the evaluation, you **must supply** 15 real room images in the `images/` directory with the exact filenames listed below.

### Living Room
- `01_living_sofa.jpg` - Sofa clearly visible
- `02_living_tv.jpg` - TV clearly visible
- `03_living_sofatv.jpg` - Sofa + TV visible
- `04_living_unrelated.jpg` - Person or unrelated object only
- `05_living_empty.jpg` - Empty room

### Bedroom
- `06_bedroom_bed.jpg` - Bed clearly visible
- `07_bedroom_bedwardrobe.jpg` - Bed + wardrobe visible
- `08_bedroom_unrelated.jpg` - Unrelated object / curtains / window

### Dining
- `09_dining_table.jpg` - Dining table clearly visible
- `10_dining_tablechairs.jpg` - Dining table + chairs visible

### Difficult Cases
- `11_diff_multi.jpg` - Multiple furniture types (e.g., Studio apartment)
- `12_diff_lowquality.jpg` - Low-quality / blurry image
- `13_diff_cluttered.jpg` - Highly cluttered room
- `14_diff_viewpoint.jpg` - Unusual viewpoint (e.g., high angle)
- `15_diff_lighting.jpg` - Extreme lighting (too dark / overexposed)

## 2. API Endpoints Tested
The script evaluates the system end-to-end by calling the Express AI Gateway APIs:
- `POST /api/ai/visual-recommend` (Authenticates user, parses image, proxies to FastAPI)
- `POST /api/ai/placement` (Authenticates user, parses image + productId, proxies to FastAPI)

## 3. How to Execute the Evaluation
Once the images are supplied:
1. Ensure both the Express API and FastAPI services are running.
2. Ensure you have Python installed and the required packages (`requests`).
3. Run the evaluation script: `python evaluate_ai.py`
4. The script will automatically generate CSV result files in `results/`.

## 4. Metrics Explained
* **Latency (ms)**: Total round-trip time from the Python client through Express to FastAPI and back.
* **Status**: HTTP status code indicating success (200) or failure.
* **Detected Class / Confidence**: The primary YOLO prediction for Visual Recommendation.
* **Mapped Category**: The rule-based category mapping for the detected object.
* **Suitable / Evaluation Confidence**: Placement heuristic results.
* **Warnings**: E.g., `DIMENSIONS_UNAVAILABLE` triggered if product lacks physical dimensions.

## 5. Limitations
* Detection accuracy is NOT calculated unless ground-truth labels are supplied.
* YOLO confidence scores are recorded but do not guarantee correct real-world identification.
* MiDaS depth is relative, so placement estimations rely on heuristical approximations, not metric distances.
