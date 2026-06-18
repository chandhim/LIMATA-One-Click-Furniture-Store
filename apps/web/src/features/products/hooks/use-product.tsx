"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchProduct } from "../services/product.service";
import type { Product } from "../types/product.types";

export function useProduct(productId: string | undefined) {
  return useQuery<Product, Error>({
    queryKey: ["product", productId],
    queryFn: () => fetchProduct(productId as string),
    enabled: Boolean(productId),
  });
}
