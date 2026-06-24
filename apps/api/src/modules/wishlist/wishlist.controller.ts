import type { Request, Response, NextFunction } from "express";
import {
  getWishlist,
  addToWishlist,
  removeWishlistItem,
} from "./wishlist.service";
import { addToWishlistSchema } from "./wishlist.validation";

export async function getWishlistController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const wishlist = await getWishlist(req.user!.id);
    res.json({ success: true, data: wishlist });
  } catch (error) {
    next(error);
  }
}

export async function addToWishlistController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const input = addToWishlistSchema.parse(req.body);
    const wishlist = await addToWishlist(req.user!.id, input);
    res.status(201).json({ success: true, data: wishlist });
  } catch (error) {
    next(error);
  }
}

export async function removeWishlistItemController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { productId } = req.params;
    const wishlist = await removeWishlistItem(req.user!.id, productId);
    res.json({ success: true, data: wishlist });
  } catch (error) {
    next(error);
  }
}
