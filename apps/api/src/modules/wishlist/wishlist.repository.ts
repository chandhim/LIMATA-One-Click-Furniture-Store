import { prisma } from "@/lib/prisma";
import type { AddToWishlistInput } from "./wishlist.validation";

const productSelect = {
  productId: true,
  name: true,
  price: true,
  images: true,
  stock: true,
} as const;

const wishlistInclude = {
  items: {
    include: { product: { select: productSelect } },
    orderBy: { createdAt: "asc" as const },
  },
};

export async function findWishlistByUserId(userId: string) {
  return prisma.wishlist.findUnique({
    where: { userId },
    include: wishlistInclude,
  });
}

export async function findOrCreateWishlist(userId: string) {
  return prisma.wishlist.upsert({
    where: { userId },
    create: { userId },
    update: {},
    include: wishlistInclude,
  });
}

export async function findWishlistItemById(wishlistItemId: string) {
  return prisma.wishlistItem.findUnique({ where: { wishlistItemId } });
}

export async function findWishlistItemByProductId(
  wishlistId: string,
  productId: string,
) {
  return prisma.wishlistItem.findUnique({
    where: { wishlistId_productId: { wishlistId, productId } },
  });
}

export async function insertWishlistItem(
  wishlistId: string,
  input: AddToWishlistInput,
) {
  return prisma.wishlistItem.create({
    data: { wishlistId, productId: input.productId },
  });
}

export async function deleteWishlistItem(wishlistItemId: string) {
  return prisma.wishlistItem.delete({ where: { wishlistItemId } });
}

export async function deleteAllWishlistItems(userId: string) {
  const wishlist = await prisma.wishlist.findUnique({
    where: { userId },
    select: { wishlistId: true },
  });
  if (!wishlist) return;
  return prisma.wishlistItem.deleteMany({
    where: { wishlistId: wishlist.wishlistId },
  });
}
