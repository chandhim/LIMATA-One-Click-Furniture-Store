import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import {
  createOrderController,
  listOrdersController,
  getOrderController,
  cancelOrderController,
  updateOrderStatusController,
  deleteDraftOrderController,
  confirmPayherePaymentClientSideController,
} from "./order.controller";

export const ordersRouter = Router();

// Protect all order endpoints with authentication
ordersRouter.use(authenticate);

ordersRouter.post("/", createOrderController);
ordersRouter.get("/", listOrdersController);
ordersRouter.get("/:orderId", getOrderController);
ordersRouter.patch("/:orderId/cancel", cancelOrderController);
ordersRouter.patch("/:orderId/status", updateOrderStatusController);
ordersRouter.delete("/:orderId/draft", deleteDraftOrderController);
ordersRouter.patch("/:orderId/confirm-payment", confirmPayherePaymentClientSideController);
