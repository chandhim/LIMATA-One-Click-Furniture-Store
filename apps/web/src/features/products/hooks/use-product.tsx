"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchProduct } from "../services/product.service";
import type { Product } from "../types/product.types";

export function useProduct(id: string | undefined) {
  return useQuery<Product, Error>(["product", id], () => fetchProduct(id as string), {
    enabled: Boolean(id),
  });
}
