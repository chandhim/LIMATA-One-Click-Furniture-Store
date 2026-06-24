import api from "@/lib/axios";
import type { Product } from "@/features/products/types/product.types";

export interface AdminProductCreate {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  material?: string;
  images?: string[];
  model3dUrl?: string;
}

// type alias avoids @typescript-eslint/no-empty-object-type
export type AdminProductUpdate = Partial<AdminProductCreate>;

export async function fetchAdminProducts() {
  const res = await api.get("/products");
  return res.data.data as Product[];
}

export async function fetchAdminProduct(productId: string) {
  const res = await api.get(`/products/${productId}`);
  return res.data.data as Product;
}

export async function createProductService(data: AdminProductCreate) {
  const res = await api.post("/products", data);
  return res.data.data as Product;
}

export async function updateProductService(
  productId: string,
  data: AdminProductUpdate,
) {
  const res = await api.put(`/products/${productId}`, data);
  return res.data.data as Product;
}

export async function deleteProductService(productId: string) {
  const res = await api.delete(`/products/${productId}`);
  return res.data.data as Product;
}

export async function uploadImages(files: File[]) {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  const res = await api.post("/products/upload-images", formData);

  return res.data.data as { urls: string[] };
}

export async function uploadModel(
  file: File,
  onUploadProgress?: (progressEvent: any) => void
) {
  const formData = new FormData();
  formData.append("model", file);

  const res = await api.post("/products/upload-model", formData, {
    onUploadProgress,
  });

  return res.data.data as { 
    url: string;
    optimizationStats?: {
      originalSize: number;
      optimizedSize: number;
      reductionPercentage: string;
      durationMs: number;
    }
  };
}
