"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchWishlist } from "../services/wishlist.service";
import { useAuthStore } from "@/features/auth/store/use-auth-store";
import { useEffect } from "react";
import { useWishlistStore } from "@/store/use-wishlist-store";

export const WISHLIST_QUERY_KEY = ["wishlist"] as const;

export function useWishlist() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setCount = useWishlistStore((state) => state.setCount);

  const query = useQuery({
    queryKey: WISHLIST_QUERY_KEY,
    queryFn: fetchWishlist,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    if (query.data) {
      const items = query.data.items || [];
      setCount(items.length);
    }
  }, [query.data, setCount]);

  return query;
}
