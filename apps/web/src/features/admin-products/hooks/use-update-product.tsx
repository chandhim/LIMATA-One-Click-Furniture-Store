"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateProductService,
  type AdminProductUpdate,
} from "../services/admin-product.service";

export function useUpdateProduct(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AdminProductUpdate) =>
      updateProductService(productId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      void queryClient.invalidateQueries({
        queryKey: ["admin-product", productId],
      });
    },
  });
}
