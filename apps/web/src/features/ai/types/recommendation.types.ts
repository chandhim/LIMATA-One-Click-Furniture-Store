export interface RecommendationPreferences {
  query?: string;
  max_price?: number;
  category?: string;
  material?: string;
}

export interface MatchingInfo {
  score: number;
  reasons: string[];
}

export interface RecommendationResponse {
  recommended_product_ids: string[];
  matching_info: Record<string, MatchingInfo>;
  metadata: {
    total_evaluated: number;
    execution_time_ms: number;
  };
}
