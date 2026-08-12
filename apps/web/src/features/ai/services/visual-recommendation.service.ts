import api from "@/lib/axios";
import type { VisualRecommendationResponse } from "../types/visual-recommendation.types";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export async function fetchVisualRecommendations(file: File) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await api.post<ApiResponse<VisualRecommendationResponse>>(
    "/ai/visual-recommend",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data.data;
}
