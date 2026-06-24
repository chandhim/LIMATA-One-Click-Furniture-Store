import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import {
  getWishlistController,
  addToWishlistController,
  removeWishlistItemController,
} from "./wishlist.controller";

export const wishlistRouter = Router();

// All wishlist routes require authentication
wishlistRouter.get("/", authenticate, getWishlistController);
wishlistRouter.post("/items", authenticate, addToWishlistController);
wishlistRouter.delete(
  "/items/:productId",
  authenticate,
  removeWishlistItemController,
);
