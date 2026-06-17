"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../services/product.service";
import type { ProductFilters, ProductListResponse } from "../types/product.types";

export function useProducts(filters: Partial<ProductFilters>) {
  return useQuery<ProductListResponse, Error>({
    queryKey: ["products", filters],
    queryFn: () => fetchProducts(filters),
    placeholderData: (prev) => prev, // keep stale data while refetching
  });
}
