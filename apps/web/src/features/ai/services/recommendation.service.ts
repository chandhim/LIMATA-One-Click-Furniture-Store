import api from "@/lib/axios";
import type {
  RecommendationPreferences,
  RecommendationResponse,
} from "../types/recommendation.types";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export async function fetchRecommendations(preferences: RecommendationPreferences) {
  const res = await api.post<ApiResponse<RecommendationResponse>>("/ai/recommend", {
    preferences,
  });

  return res.data.data;
}
