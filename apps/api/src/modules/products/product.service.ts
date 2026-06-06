import { prisma } from "@/lib/prisma";
import type { Product } from "@prisma/client";
import type { ProductCreate, ProductUpdate } from "./product.validation";

export async function getProducts(opts: {
  search?: string;
  category?: string;
}) {
  const { search, category } = opts;

  const where: any = {};

  if (search) {
    where.name = { contains: search, mode: "insensitive" };
  }

  if (category) {
    where.category = category;
  }

  const products = await prisma.product.findMany({
    where,
    select: {
      id: true,
      name: true,
      price: true,
      category: true,
      images: true,
      stock: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return products as Array<
    Pick<Product, "id" | "name" | "price" | "category" | "images" | "stock">
  >;
}

export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  return product as Product | null;
}

export async function createProduct(data: ProductCreate) {
  const product = await prisma.product.create({
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

  return product;
}

export async function updateProduct(id: string, data: ProductUpdate) {
  const product = await prisma.product.update({
    where: { id },
    data,
  });

  return product;
}

export async function deleteProduct(id: string) {
  const product = await prisma.product.delete({
    where: { id },
  });

  return product;
}
