export interface PlacementEvaluationResult {
  suitable: boolean;
  evaluation_confidence: number;
  warnings: string[];
  limiting_factor: string | null;
  estimated_clearance: Record<string, number> | null;
  evaluated_orientation: string | null;
  evaluation_metadata: Record<string, unknown>;
}
