"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../services/product.service";
import type { ProductSummary } from "../types/product.types";

export function useProducts(search?: string, category?: string) {
  return useQuery<ProductSummary[], Error>({
    queryKey: ["products", { search, category }],
    queryFn: () => fetchProducts({ search, category }),
  });
}
