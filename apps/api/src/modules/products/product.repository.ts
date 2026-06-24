import type { Product } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { ProductCreate, ProductUpdate } from "./product.validation";

/**
 * Fetch a filtered list of products (public catalogue).
 * Returns only the fields needed for the product card / list view.
 */
export async function findProducts(opts: {
  search?: string;
  category?: string;
}) {
  const { search, category } = opts;

  const where: Record<string, unknown> = {};

  if (search) {
    where.name = { contains: search, mode: "insensitive" };
  }

  if (category) {
    where.category = category;
  }

  const products = await prisma.product.findMany({
    where,
    select: {
      productId: true,
      name: true,
      price: true,
      category: true,
      images: true,
      stock: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return products as Array<
    Pick<
      Product,
      "productId" | "name" | "price" | "category" | "images" | "stock"
    >
  >;
}

/**
 * Fetch a single product by its primary key (cuid).
 * Returns the full Product record.
 */
export async function findProductById(productId: string) {
  const product = await prisma.product.findUnique({ where: { productId } });
  return product as Product | null;
}

/**
 * Insert a new product into the database.
 */
export async function insertProduct(data: ProductCreate) {
  return prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      category: data.category,
      material: data.material,
      images: data.images ?? [],
      model3dUrl: data.model3dUrl ?? null,
    },
  });
}

/**
 * Update an existing product by id.
 */
export async function updateProductById(
  productId: string,
  data: ProductUpdate,
) {
  return prisma.product.update({ where: { productId }, data });
}

/**
 * Hard-delete a product by id.
 */
export async function deleteProductById(productId: string) {
  return prisma.product.delete({ where: { productId } });
}
