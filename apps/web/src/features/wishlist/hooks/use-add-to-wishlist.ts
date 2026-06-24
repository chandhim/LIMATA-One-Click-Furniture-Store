"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToWishlist } from "../services/wishlist.service";
import { WISHLIST_QUERY_KEY } from "./use-wishlist";
import { toast } from "sonner";

export function useAddToWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => addToWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
      toast.success("Added to wishlist");
    },
    onError: () => {
      toast.error("Failed to add to wishlist");
    },
  });
}
