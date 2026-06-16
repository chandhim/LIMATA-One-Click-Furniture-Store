"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clearCart } from "../services/cart.service";
import { CART_QUERY_KEY } from "./use-cart";

export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
}
