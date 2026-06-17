import type { Product } from "@prisma/client";
import type { ProductCreate, ProductUpdate } from "./product.validation";
import {
  findProducts,
  findProductById,
  insertProduct,
  updateProductById,
  deleteProductById,
} from "./product.repository";

export async function getProducts(opts: {
  search?:   string;
  category?: string;
  material?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?:  string;
  sort?:     string;
  page?:     number;
  limit?:    number;
}) {
  return findProducts(opts);
}

export async function getProductById(id: string) {
  return findProductById(id) as Promise<Product | null>;
}

export async function createProduct(data: ProductCreate) {
  return insertProduct(data);
}

export async function updateProduct(id: string, data: ProductUpdate) {
  return updateProductById(id, data);
}

export async function deleteProduct(id: string) {
  return deleteProductById(id);
}
