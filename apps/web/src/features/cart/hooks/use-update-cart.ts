"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCartItem } from "../services/cart.service";
import { CART_QUERY_KEY } from "./use-cart";

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      updateCartItem(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
}
