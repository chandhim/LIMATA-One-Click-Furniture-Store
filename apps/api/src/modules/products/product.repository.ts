import type { Product, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { ProductCreate, ProductUpdate } from "./product.validation";

/**
 * Fetch a filtered, sorted, paginated list of products (public catalogue).
 * Returns { products, total } so the frontend can render pagination.
 */
export async function findProducts(opts: {
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
  const {
    search,
    category,
    material,
    minPrice,
    maxPrice,
    inStock,
    sort    = "newest",
    page    = 1,
    limit   = 12,
  } = opts;

  const where: Prisma.ProductWhereInput = {};

  // Search across name AND description
  if (search) {
    where.OR = [
      { name:        { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (category) where.category = { equals: category, mode: "insensitive" };
  if (material) where.material = { equals: material, mode: "insensitive" };
  if (inStock === "true")  where.stock = { gt: 0 };
  if (inStock === "false") where.stock = { equals: 0 };

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) (where.price as Prisma.FloatFilter).gte = minPrice;
    if (maxPrice !== undefined) (where.price as Prisma.FloatFilter).lte = maxPrice;
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "price_asc"  ? { price: "asc" } :
    sort === "price_desc" ? { price: "desc" } :
    sort === "name_asc"   ? { name: "asc" } :
    sort === "name_desc"  ? { name: "desc" } :
    { createdAt: "desc" };                      // default: newest

  const skip = (page - 1) * limit;

  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      select: {
        id: true,
        name: true,
        price: true,
        category: true,
        images: true,
        stock: true,
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total };
}

/**
 * Fetch a single product by its primary key (cuid).
 * Returns the full Product record.
 */
export async function findProductById(id: string) {
  const product = await prisma.product.findUnique({ where: { id } });
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
export async function updateProductById(id: string, data: ProductUpdate) {
  return prisma.product.update({ where: { id }, data });
}

/**
 * Hard-delete a product by id.
 */
export async function deleteProductById(id: string) {
  return prisma.product.delete({ where: { id } });
}
