import type { NextFunction, Request, Response } from "express";
import { ApiError } from "@/shared/errors/api-error";
import {
  addToCartSchema,
  updateCartItemSchema,
  cartItemParamSchema,
} from "./cart.validation";
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "./cart.service";

function sendResponse(res: Response, status: number, data: unknown) {
  return res.status(status).json({ success: true, message: "ok", data });
}

export async function getCartController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) throw new ApiError(401, "Unauthorized");
    const cart = await getCart(req.user.id);
    return sendResponse(res, 200, cart);
  } catch (error) {
    return next(error);
  }
}

export async function addToCartController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) throw new ApiError(401, "Unauthorized");
    const input = addToCartSchema.parse(req.body);
    const cart = await addItemToCart(req.user.id, input);
    return sendResponse(res, 200, cart);
  } catch (error) {
    return next(error);
  }
}

export async function updateCartItemController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) throw new ApiError(401, "Unauthorized");
    const { itemId } = cartItemParamSchema.parse(req.params);
    const input = updateCartItemSchema.parse(req.body);
    const item = await updateCartItem(req.user.id, itemId, input);
    return sendResponse(res, 200, item);
  } catch (error) {
    return next(error);
  }
}

export async function removeCartItemController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) throw new ApiError(401, "Unauthorized");
    const { itemId } = cartItemParamSchema.parse(req.params);
    await removeCartItem(req.user.id, itemId);
    return sendResponse(res, 200, { itemId });
  } catch (error) {
    return next(error);
  }
}

export async function clearCartController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) throw new ApiError(401, "Unauthorized");
    await clearCart(req.user.id);
    return sendResponse(res, 200, null);
  } catch (error) {
    return next(error);
  }
}
