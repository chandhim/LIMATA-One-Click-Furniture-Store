import api from "@/lib/axios";
import type { PlacementEvaluationResult } from "../types/placement.types";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export async function evaluatePlacement(productId: string, image: File) {
  const formData = new FormData();
  formData.append("productId", productId);
  formData.append("image", image);

  const res = await api.post<ApiResponse<PlacementEvaluationResult>>(
    "/ai/placement",
    formData
  );

  return res.data.data;
}
