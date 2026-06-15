import api from "@/lib/axios";
import type { Product, ProductSummary } from "../types/product.types";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export async function fetchProducts(params?: { search?: string; category?: string }) {
  const res = await api.get<ApiResponse<ProductSummary[]>>(
    "/products",
    { params },
  );

  return res.data.data;
}

export async function fetchProduct(id: string) {
  const res = await api.get<ApiResponse<Product>>(`/products/${id}`);
  return res.data.data;
}
