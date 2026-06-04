import api from "@/lib/axios";

export interface AdminProductCreate {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  material?: string;
}

export interface AdminProductUpdate extends Partial<AdminProductCreate> {}

export async function fetchAdminProducts() {
  const res = await api.get("/products");
  return res.data.data as any[];
}

export async function fetchAdminProduct(id: string) {
  const res = await api.get(`/products/${id}`);
  return res.data.data as any;
}

export async function createProductService(data: AdminProductCreate) {
  const res = await api.post("/products", data);
  return res.data.data as any;
}

export async function updateProductService(id: string, data: AdminProductUpdate) {
  const res = await api.put(`/products/${id}`, data);
  return res.data.data as any;
}

export async function deleteProductService(id: string) {
  const res = await api.delete(`/products/${id}`);
  return res.data.data as any;
}

export async function uploadImages(files: File[]) {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  const res = await api.post("/products/upload-images", formData);

  return res.data.data as { urls: string[] };
}

export async function uploadModel(file: File) {
  const formData = new FormData();
  formData.append("model", file);

  const res = await api.post("/products/upload-model", formData);

  return res.data.data as { url: string };
}
