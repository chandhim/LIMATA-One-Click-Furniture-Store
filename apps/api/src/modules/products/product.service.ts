import { prisma } from "@/lib/prisma";
import type { Product } from "@prisma/client";

export async function getProducts(opts: { search?: string; category?: string }) {
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

  return products as Array<Pick<Product, "id" | "name" | "price" | "category" | "images" | "stock">>;
}

export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  return product as Product | null;
}
