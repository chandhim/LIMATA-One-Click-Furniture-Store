import api from "@/lib/axios";
import type { Product, ProductFilters, ProductListResponse } from "../types/product.types";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export async function fetchProducts(filters: Partial<ProductFilters>) {
  // Strip empty/default values so Axios doesn't pollute the query string
  const params: Record<string, string | number | boolean> = {};
  if (filters.search)                              params.search   = filters.search;
  if (filters.category)                            params.category = filters.category;
  if (filters.material)                            params.material = filters.material;
  if (filters.minPrice)                            params.minPrice = filters.minPrice;
  if (filters.maxPrice)                            params.maxPrice = filters.maxPrice;
  if (filters.inStock)                             params.inStock  = "true";
  if (filters.sort && filters.sort !== "newest")   params.sort     = filters.sort;
  if (filters.page && filters.page > 1)            params.page     = filters.page;

  const res = await api.get<ApiResponse<ProductListResponse>>("/products", { params });
  return res.data.data;
}

export async function fetchProduct(id: string) {
  const res = await api.get<ApiResponse<Product>>(`/products/${id}`);
  return res.data.data;
}
