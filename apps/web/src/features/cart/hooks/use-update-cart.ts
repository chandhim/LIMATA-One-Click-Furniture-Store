"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCartItem } from "../services/cart.service";
import { CART_QUERY_KEY } from "./use-cart";

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      cartItemId,
      quantity,
    }: {
      cartItemId: string;
      quantity: number;
    }) => updateCartItem(cartItemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
}
