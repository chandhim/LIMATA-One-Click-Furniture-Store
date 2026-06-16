"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeCartItem } from "../services/cart.service";
import { CART_QUERY_KEY } from "./use-cart";

export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => removeCartItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
}
