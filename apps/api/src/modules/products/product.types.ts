import type { Product } from "@prisma/client";

/**
 * Shape returned by the product list endpoint.
 * Intentionally omits description, material, model3dUrl, timestamps
 * to keep list payloads lightweight.
 */
export type ProductListItem = Pick<
  Product,
  "productId" | "name" | "price" | "category" | "images" | "stock"
>;

/**
 * Full product detail — mirrors the Prisma Product model exactly.
 * Used by GET /api/products/:id
 */
export type ProductDetail = Product;
