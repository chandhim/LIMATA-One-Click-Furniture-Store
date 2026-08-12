import { useMutation } from "@tanstack/react-query";
import { evaluatePlacement } from "../services/placement.service";

export function usePlacement() {
  return useMutation({
    mutationFn: ({ productId, image }: { productId: string; image: File }) =>
      evaluatePlacement(productId, image),
  });
}
