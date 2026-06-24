import { prisma } from "@/lib/prisma";
import type { AddToCartInput, UpdateCartItemInput } from "./cart.validation";

/** Fields selected from Product when loading cart items. */
const productSelect = {
  productId: true,
  name: true,
  price: true,
  images: true,
  stock: true,
} as const;

/** Standard include for a cart with all its items + products. */
const cartInclude = {
  items: {
    include: { product: { select: productSelect } },
    orderBy: { createdAt: "asc" as const },
  },
};

/**
 * Fetch a user's cart. Returns null when they have no cart yet.
 */
export async function findCartByUserId(userId: string) {
  return prisma.cart.findUnique({ where: { userId }, include: cartInclude });
}

/**
 * Upsert: create the cart if it does not exist, otherwise leave it as-is.
 * Always returns the full cart with items.
 */
export async function findOrCreateCart(userId: string) {
  return prisma.cart.upsert({
    where: { userId },
    create: { userId },
    update: {},
    include: cartInclude,
  });
}

/** Fetch a single cart item by its primary key. */
export async function findCartItemById(cartItemId: string) {
  return prisma.cartItem.findUnique({ where: { cartItemId } });
}

/** Find an existing cart item for a given product inside a cart. */
export async function findCartItemByProductId(
  cartId: string,
  productId: string,
) {
  return prisma.cartItem.findFirst({ where: { cartId, productId } });
}

/** Insert a brand-new cart item. */
export async function insertCartItem(cartId: string, input: AddToCartInput) {
  return prisma.cartItem.create({
    data: { cartId, productId: input.productId, quantity: input.quantity },
  });
}

/** Increment the quantity of an existing cart item. */
export async function incrementCartItemQuantity(
  cartItemId: string,
  by: number,
) {
  return prisma.cartItem.update({
    where: { cartItemId },
    data: { quantity: { increment: by } },
  });
}

/** Overwrite the quantity of a cart item. */
export async function updateCartItemQuantity(
  cartItemId: string,
  input: UpdateCartItemInput,
) {
  return prisma.cartItem.update({
    where: { cartItemId },
    data: { quantity: input.quantity },
  });
}

/** Hard-delete a single cart item. */
export async function deleteCartItem(cartItemId: string) {
  return prisma.cartItem.delete({ where: { cartItemId } });
}

/** Remove every item from a user's cart (clear cart). */
export async function deleteAllCartItems(userId: string) {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    select: { cartId: true },
  });
  if (!cart) return;
  return prisma.cartItem.deleteMany({ where: { cartId: cart.cartId } });
}
