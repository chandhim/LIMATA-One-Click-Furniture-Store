import { useMutation } from "@tanstack/react-query";
import { fetchVisualRecommendations } from "../services/visual-recommendation.service";
import type { VisualRecommendationResponse } from "../types/visual-recommendation.types";

export function useVisualRecommend() {
  return useMutation<VisualRecommendationResponse, Error, { image: File }>({
    mutationFn: ({ image }) => fetchVisualRecommendations(image),
  });
}
