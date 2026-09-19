import { prisma } from "@/lib/prisma";
import { ApiError } from "@/shared/errors/api-error";
import type { AddToCartInput, UpdateCartItemInput } from "./cart.validation";
import {
  findCartByUserId,
  findOrCreateCart,
  findCartItemById,
  findCartItemByProductId,
  insertCartItem,
  incrementCartItemQuantity,
  updateCartItemQuantity,
  deleteCartItem,
  deleteAllCartItems,
} from "./cart.repository";

/** Return the user's cart, or a typed empty shell when none exists yet. */
export async function getCart(userId: string) {
  const cart = await findCartByUserId(userId);
  if (!cart) {
    return { cartId: null, userId, items: [] };
  }
  return cart;
}

/**
 * Add a product to the cart.
 * - If the product is already in the cart, quantity is incremented.
 * - Validates stock before writing.
 */
export async function addItemToCart(userId: string, input: AddToCartInput) {
  const product = await prisma.product.findUnique({
    where: { productId: input.productId },
    select: { stock: true },
  });

  if (!product) {
    throw new ApiError(404, "This product could not be found. It may have been removed from the store.");
  }

  if (product.stock < input.quantity) {
    throw new ApiError(400, "Sorry, there is not enough stock available for the quantity you requested.");
  }

  const cart = await findOrCreateCart(userId);
  const existing = await findCartItemByProductId(cart.cartId, input.productId);

  if (existing) {
    const newQty = existing.quantity + input.quantity;
    if (product.stock < newQty) {
      throw new ApiError(400, "Adding that many would exceed the available stock. Please reduce the quantity.");
    }
    await incrementCartItemQuantity(existing.cartItemId, input.quantity);
  } else {
    await insertCartItem(cart.cartId, input);
  }

  return findOrCreateCart(userId);
}

/**
 * Update the quantity of a specific cart item.
 * Verifies the item belongs to the requesting user's cart.
 */
export async function updateCartItem(
  userId: string,
  cartItemId: string,
  input: UpdateCartItemInput,
) {
  const item = await findCartItemById(cartItemId);
  if (!item) {
    throw new ApiError(404, "This item could not be found in your cart.");
  }

  const cart = await findCartByUserId(userId);
  if (!cart || item.cartId !== cart.cartId) {
    throw new ApiError(403, "You do not have permission to modify this cart item.");
  }

  const product = await prisma.product.findUnique({
    where: { productId: item.productId },
    select: { stock: true },
  });

  if (!product || product.stock < input.quantity) {
    throw new ApiError(400, "Sorry, there is not enough stock available for the quantity you requested.");
  }

  return updateCartItemQuantity(cartItemId, input);
}

/**
 * Remove a single item from the cart.
 * Verifies the item belongs to the requesting user's cart.
 */
export async function removeCartItem(userId: string, cartItemId: string) {
  const item = await findCartItemById(cartItemId);
  if (!item) {
    throw new ApiError(404, "This item could not be found in your cart.");
  }

  const cart = await findCartByUserId(userId);
  if (!cart || item.cartId !== cart.cartId) {
    throw new ApiError(403, "You do not have permission to modify this cart item.");
  }

  return deleteCartItem(cartItemId);
}

/** Delete all items from the user's cart. */
export async function clearCart(userId: string) {
  return deleteAllCartItems(userId);
}
