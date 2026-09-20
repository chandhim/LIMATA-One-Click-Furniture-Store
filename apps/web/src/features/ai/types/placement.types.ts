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

export const LIMITING_FACTOR_COPY: Record<string, { label: string; description: string }> = {
  OBSTACLE_PROXIMITY: {
    label: "Nearby obstacles & tight clearance",
    description: "Nearby furniture or walls appear too close to this spot, leaving insufficient open clearance for this item.",
  },
  CONGESTION: {
    label: "Crowded room area",
    description: "This area is already crowded with existing furniture, leaving limited open floor space.",
  },
  MOVEMENT_SPACE: {
    label: "Limited walking space",
    description: "Placing this item here may leave too little walkway space to move around comfortably.",
  },
  MOVEMENT_SPACE_SEVERELY_RESTRICTED: {
    label: "Severely restricted walkway",
    description: "There appears to be inadequate clearance to walk around this item once placed.",
  },
  MOVEMENT_SPACE_RESTRICTED: {
    label: "Restricted movement space",
    description: "Walking space around this item may feel tight once positioned in this spot.",
  },
  DOES_NOT_FIT_WIDTH: {
    label: "Insufficient width",
    description: "The available floor or wall width appears narrower than this product's dimensions.",
  },
  DOES_NOT_FIT_DEPTH: {
    label: "Insufficient depth",
    description: "The available floor depth appears too shallow to accommodate this product comfortably.",
  },
  DOES_NOT_FIT_HEIGHT: {
    label: "Insufficient vertical height",
    description: "The vertical space in this spot appears lower than this product's height.",
  },
  DOES_NOT_FIT_AREA: {
    label: "Insufficient floor footprint",
    description: "The overall floor footprint required for this item exceeds the open space available.",
  },
};

export function formatLimitingFactorDescription(factor?: string | null): string {
  if (!factor) return "";
  const match = LIMITING_FACTOR_COPY[factor.toUpperCase()];
  if (match) {
    return match.description;
  }
  const clean = factor.replace(/[_-]/g, " ").toLowerCase();
  return `Insufficient clearance or space (${clean}) appears to be the main consideration for this placement.`;
}

export function formatLimitingFactorLabel(factor?: string | null): string {
  if (!factor) return "";
  const match = LIMITING_FACTOR_COPY[factor.toUpperCase()];
  if (match) {
    return match.label;
  }
  return factor.replace(/[_-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
