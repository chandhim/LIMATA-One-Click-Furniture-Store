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
  search?: string;
  category?: string;
}) {
  return findProducts(opts);
}

export async function getProductById(productId: string) {
  return findProductById(productId) as Promise<Product | null>;
}

export async function createProduct(data: ProductCreate) {
  return insertProduct(data);
}

export async function updateProduct(productId: string, data: ProductUpdate) {
  return updateProductById(productId, data);
}

export async function deleteProduct(productId: string) {
  return deleteProductById(productId);
}
