## Phase 3: MiDaS Integration

### 1. MiDaS Registration Details
The official `midas_v21_small_256.pt` model was successfully downloaded via PyTorch Hub into the project's models directory and registered using `ModelRegistry`:
- **Model Name**: MiDaS Small v2.1
- **Framework**: PyTorch / intel-isl
- **Weights Path**: `models/midas/checkpoints/midas_v21_small_256.pt`
- **Version**: v2.1

### 2. Runtime State Transitions
The test logged the expected transitions when lazy-loading MiDaS via PyTorch Hub:
`NOT_LOADED` -> `LOADING` -> `READY`

Once `READY`, the loaded MiDaS model instance and its associated PyTorch transform were effectively cached. A secondary request did not re-trigger loading.

### 3. First Depth Inference & Integration Test Results
The integration test loaded an official sample image (`bus.jpg`) and executed it through the `AIOrchestrator`'s new `estimate_depth()` function:
- **Image Size**: `1080x810`
- **Output Depth Map**: `(1080, 810)` numpy array.
- **Inference Time Tracked**: Time was successfully tracked via `time.perf_counter()`.
- **DepthResult Generation**: The `converters.py` logic accurately extracted the tensor from MiDaS, interpolated it to the original image dimensions using bicubic upsampling, and packaged the data into the framework-agnostic `DepthResult` DTO.
- **Test Status**: `PASSED`
