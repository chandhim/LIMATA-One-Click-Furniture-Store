import type { Product } from "@prisma/client";
import type { ProductCreate, ProductUpdate } from "./product.validation";
import {
  findProducts,
  findProductById,
  insertProduct,
  updateProductById,
  deleteProductById,
} from "./product.repository";
import { deleteFromR2 } from "@/lib/storage";

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
  const oldProduct = await findProductById(productId);
  if (oldProduct) {
    if (data.model3dUrl !== undefined && data.model3dUrl !== oldProduct.model3dUrl) {
      if (oldProduct.model3dUrl) {
        await deleteFromR2(oldProduct.model3dUrl);
      }
    }
    if (data.images !== undefined) {
      const deletedImages = oldProduct.images.filter((img: string) => !data.images?.includes(img));
      for (const img of deletedImages) {
        await deleteFromR2(img);
      }
    }
  }
  return updateProductById(productId, data);
}

export async function deleteProduct(productId: string) {
  const oldProduct = await findProductById(productId);
  if (oldProduct) {
    if (oldProduct.model3dUrl) {
      await deleteFromR2(oldProduct.model3dUrl);
    }
    for (const img of oldProduct.images) {
      await deleteFromR2(img);
    }
  }
  return deleteProductById(productId);
}
