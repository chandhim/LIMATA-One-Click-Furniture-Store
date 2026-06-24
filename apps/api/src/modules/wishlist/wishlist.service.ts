import { ApiError } from "@/shared/errors/api-error";
import {
  findOrCreateWishlist,
  findWishlistByUserId,
  findWishlistItemByProductId,
  insertWishlistItem,
  deleteWishlistItem,
} from "./wishlist.repository";
import type { AddToWishlistInput } from "./wishlist.validation";
import { prisma } from "@/lib/prisma";

export async function getWishlist(userId: string) {
  const wishlist = await findWishlistByUserId(userId);
  if (!wishlist) {
    return { items: [] };
  }
  return wishlist;
}

export async function addToWishlist(userId: string, input: AddToWishlistInput) {
  const product = await prisma.product.findUnique({
    where: { productId: input.productId },
  });
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const wishlist = await findOrCreateWishlist(userId);
  const existingItem = await findWishlistItemByProductId(
    wishlist.wishlistId,
    input.productId,
  );

  if (existingItem) {
    return findWishlistByUserId(userId);
  }

  await insertWishlistItem(wishlist.wishlistId, input);
  return findWishlistByUserId(userId);
}

export async function removeWishlistItem(userId: string, productId: string) {
  const wishlist = await findWishlistByUserId(userId);
  if (!wishlist) throw new ApiError(404, "Wishlist not found");

  const item = await findWishlistItemByProductId(
    wishlist.wishlistId,
    productId,
  );
  if (!item) throw new ApiError(404, "Wishlist item not found");

  await deleteWishlistItem(item.wishlistItemId);
  return findWishlistByUserId(userId);
}
