import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import {
  getCartController,
  addToCartController,
  updateCartItemController,
  removeCartItemController,
  clearCartController,
} from "./cart.controller";

export const cartRouter = Router();

// All cart routes require authentication
cartRouter.get("/", authenticate, getCartController);
cartRouter.post("/items", authenticate, addToCartController);
cartRouter.patch("/items/:itemId", authenticate, updateCartItemController);
cartRouter.delete("/items/:itemId", authenticate, removeCartItemController);
cartRouter.delete("/", authenticate, clearCartController);
