import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { GetReviewsResponse, ReviewEligibilityResponse } from "../types/review.types";

export function useProductReviews(productId: string, sort: string = "recent") {
  return useQuery({
    queryKey: ["reviews", productId, sort],
    queryFn: async () => {
      const res = await apiClient.get<{
        success: boolean;
        data: GetReviewsResponse;
      }>(`/api/products/${productId}/reviews`, { params: { sort } });
      return res.data.data;
    },
    enabled: !!productId,
  });
}

export function useReviewEligibility(productId: string, isAuthenticated: boolean) {
  return useQuery({
    queryKey: ["review-eligibility", productId],
    queryFn: async () => {
      const res = await apiClient.get<{
        success: boolean;
        data: ReviewEligibilityResponse;
      }>(`/api/products/${productId}/reviews/eligibility`);
      return res.data.data;
    },
    enabled: !!productId && isAuthenticated,
    retry: false,
  });
}

export function useSubmitReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      rating,
      title,
      comment,
    }: {
      productId: string;
      rating: number;
      title: string;
      comment: string;
    }) => {
      const res = await apiClient.post(`/api/products/${productId}/reviews`, {
        rating,
        title,
        comment,
      });
      return res.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate both eligibility and reviews
      queryClient.invalidateQueries({
        queryKey: ["review-eligibility", variables.productId],
      });
      queryClient.invalidateQueries({
        queryKey: ["reviews", variables.productId],
      });
    },
  });
}
