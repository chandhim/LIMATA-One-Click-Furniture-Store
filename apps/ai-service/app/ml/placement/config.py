class PlacementConfig:
    """
    Centralized, tunable heuristic thresholds for the deterministic placement pipeline
    (congestion, obstacle proximity, dimensional fit, movement space).

    IMPORTANT LIMITATION: apps/ai-service has no camera calibration and no metric
    depth sensor. YOLO produces pixel-space bounding boxes and MiDaS produces
    *relative* inverse depth from a single RGB frame — there is no reliable way to
    convert pixels into centimeters. None of the constants below are measured from
    the physical world; they are engineering assumptions that keep the heuristics
    directionally useful. Every result derived from them must be treated as an
    estimate, never as an exact measurement, and surfaced to users with that framing.
    """

    # --- Scene congestion (existing behavior — values unchanged, only centralized here) ---
    CONGESTION_HIGH = 0.7
    CONGESTION_MODERATE = 0.4

    # --- Obstacle proximity (existing behavior — values unchanged, only centralized here) ---
    OBSTACLE_PROXIMITY_DEPTH_RATIO = 2.0

    # --- Dimensional-fit calibration (new) ---
    # Assumed real-world floor width/depth (cm) captured by a typical room photo taken
    # at normal smartphone distance. Used ONLY to translate the existing pixel-coverage
    # based "available space ratio" (1 - congestion_index) into an approximate
    # centimeter figure so real product dimensions can be compared against it. This is
    # NOT derived from camera intrinsics or any calibration step — tune these two
    # numbers if field results are consistently too strict or too lenient.
    ASSUMED_FRAME_WIDTH_CM = 400.0
    ASSUMED_FRAME_DEPTH_CM = 350.0

    # --- Movement-space heuristic (new) ---
    MOVEMENT_SEVERE_CONGESTION = 0.85
    MOVEMENT_RESTRICTED_CONGESTION = 0.6
    # How much weight the *candidate* furniture's own footprint adds to projected
    # congestion when estimating post-placement movement space.
    MOVEMENT_FOOTPRINT_WEIGHT = 0.5

    # --- Alternative-recommendation ranking (new) ---
    MAX_ALTERNATIVE_RECOMMENDATIONS = 3
