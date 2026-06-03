import api from "@/lib/axios";
import type { Product, ProductSummary } from "../types/product.types";

export async function fetchProducts(params?: { search?: string; category?: string }) {
  const res = await api.get<ProductSummary[]>(
    "/products",
    { params },
  );

  return res.data as ProductSummary[];
}

export async function fetchProduct(id: string) {
  const res = await api.get<Product>(`/products/${id}`);
  return res.data as Product;
}
