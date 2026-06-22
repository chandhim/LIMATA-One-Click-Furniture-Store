"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createProductService,
  type AdminProductCreate,
} from "../services/admin-product.service";

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AdminProductCreate) => createProductService(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });
}
