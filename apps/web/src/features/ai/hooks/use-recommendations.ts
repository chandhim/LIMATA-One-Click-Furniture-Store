import { useMutation } from "@tanstack/react-query";
import { fetchRecommendations } from "../services/recommendation.service";
import type { RecommendationPreferences, RecommendationResponse } from "../types/recommendation.types";

export function useRecommendations() {
  return useMutation<RecommendationResponse, Error, RecommendationPreferences>({
    mutationFn: (preferences: RecommendationPreferences) =>
      fetchRecommendations(preferences),
  });
}
