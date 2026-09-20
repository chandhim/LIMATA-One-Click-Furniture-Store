import { useMutation } from "@tanstack/react-query";
import { fetchVisualRecommendations } from "../services/visual-recommendation.service";
import type { VisualRecommendationResponse } from "../types/visual-recommendation.types";
import type { AppError } from "@/lib/axios";

export function useVisualRecommend() {
  return useMutation<VisualRecommendationResponse, AppError, { image: File }>({
    mutationFn: ({ image }) => fetchVisualRecommendations(image),
  });
}
