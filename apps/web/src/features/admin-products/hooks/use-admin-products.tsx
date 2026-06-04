"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAdminProducts, fetchAdminProduct } from "../services/admin-product.service";

export function useAdminProducts() {
  return useQuery({
    queryKey: ["admin-products"],
    queryFn: fetchAdminProducts,
  });
}

export function useAdminProduct(id: string) {
  return useQuery({
    queryKey: ["admin-product", id],
    queryFn: () => fetchAdminProduct(id),
    enabled: !!id,
  });
}
