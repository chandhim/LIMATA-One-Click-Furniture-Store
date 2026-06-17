import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import {
  createOrderController,
  listOrdersController,
  getOrderController,
  cancelOrderController,
  updateOrderStatusController,
} from "./order.controller";

export const ordersRouter = Router();

// Protect all order endpoints with authentication
ordersRouter.use(authenticate);

ordersRouter.post("/", createOrderController);
ordersRouter.get("/", listOrdersController);
ordersRouter.get("/:id", getOrderController);
ordersRouter.patch("/:id/cancel", cancelOrderController);
ordersRouter.patch("/:id/status", updateOrderStatusController);
