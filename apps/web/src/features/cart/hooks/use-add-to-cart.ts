"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCart } from "../services/cart.service";
import { CART_QUERY_KEY } from "./use-cart";

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity?: number;
    }) => addToCart(productId, quantity ?? 1),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
}
