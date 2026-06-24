"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeWishlistItem } from "../services/wishlist.service";
import { WISHLIST_QUERY_KEY } from "./use-wishlist";
import { toast } from "sonner";

export function useRemoveWishlistItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => removeWishlistItem(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
      toast.success("Removed from wishlist");
    },
    onError: () => {
      toast.error("Failed to remove from wishlist");
    },
  });
}
