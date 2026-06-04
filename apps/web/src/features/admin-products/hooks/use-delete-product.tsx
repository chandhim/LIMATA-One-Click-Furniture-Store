"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProductService } from "../services/admin-product.service";

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProductService(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });
}
