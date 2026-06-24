"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCart } from "../services/cart.service";
import { useCartStore } from "@/store/use-cart-store";
import { useAuthStore } from "@/features/auth/store/use-auth-store";
import type { Cart } from "../types/cart.types";

export const CART_QUERY_KEY = ["cart"] as const;

/**
 * Fetch the current user's cart.
 * Automatically syncs the total item count into Zustand for the navbar badge.
 * Query is disabled when the user is not authenticated.
 */
export function useCart() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setCount = useCartStore((s) => s.setCount);
  const resetCount = useCartStore((s) => s.reset);

  const query = useQuery<Cart, Error>({
    queryKey: CART_QUERY_KEY,
    queryFn: fetchCart,
    enabled: isAuthenticated,
    staleTime: 1000 * 30, // 30 s
  });

  useEffect(() => {
    if (!isAuthenticated) {
      resetCount();
      return;
    }
    if (query.data) {
      const total = query.data.items.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
      setCount(total);
    }
  }, [query.data, isAuthenticated, setCount, resetCount]);

  return query;
}
