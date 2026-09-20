export interface VisualContext {
  detected_class: string | null;
  confidence: number | null;
  mapped_category: string | null;
  search_query: string | null;
  space_availability: "Limited" | "Moderate" | "Generous" | null;
}

export interface VisualRecommendationResponse {
  recommended_product_ids: string[];
  matching_info: Record<string, { score: number; reasons: string[] }>;
  metadata: {
    total_evaluated: number;
    execution_time_ms: number;
    visual_processing_time_ms: number;
  };
  visual_context: VisualContext;
}
