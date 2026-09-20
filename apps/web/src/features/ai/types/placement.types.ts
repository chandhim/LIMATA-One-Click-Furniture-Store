export type DimensionalFitStatus =
  | "FITS"
  | "DOES_NOT_FIT_WIDTH"
  | "DOES_NOT_FIT_DEPTH"
  | "DOES_NOT_FIT_HEIGHT"
  | "DIMENSIONS_UNAVAILABLE"
  | "INSUFFICIENT_SCENE_DATA";

export type MovementSpaceStatus =
  | "MOVEMENT_SPACE_OK"
  | "MOVEMENT_SPACE_RESTRICTED"
  | "MOVEMENT_SPACE_SEVERELY_RESTRICTED"
  | "MOVEMENT_SPACE_UNAVAILABLE";

export interface PlacementAlternativeProduct {
  productId: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  [key: string]: unknown;
}

export interface PlacementAlternativeRecommendation {
  productId: string;
  reason: string;
  orientation: string;
  footprint_cm2: number;
  product?: PlacementAlternativeProduct | null;
}

export interface PlacementEvaluationResult {
  suitable: boolean;
  evaluation_confidence: number;
  warnings: string[];
  limiting_factor: string | null;
  estimated_clearance: Record<string, number> | number | null;
  evaluated_orientation: string | null;
  evaluation_metadata: Record<string, unknown>;
  dimensional_fit: DimensionalFitStatus;
  movement_space: MovementSpaceStatus;
  alternative_recommendations: PlacementAlternativeRecommendation[];
}
