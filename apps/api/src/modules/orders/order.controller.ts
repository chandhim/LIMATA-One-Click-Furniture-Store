import type { NextFunction, Request, Response } from "express";
import { ApiError } from "@/shared/errors/api-error";
import { createOrderSchema } from "./order.validation";
import {
  placeOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatusByAdmin,
} from "./order.service";

function sendResponse(res: Response, status: number, data: unknown) {
  return res.status(status).json({ success: true, message: "ok", data });
}

export async function createOrderController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }
    const input = createOrderSchema.parse(req.body);
    const order = await placeOrder(req.user.id, input);

    return sendResponse(res, 201, order);
  } catch (error) {
    return next(error);
  }
}

export async function listOrdersController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }
    const orders = await getUserOrders(req.user.id);
    return sendResponse(res, 200, orders);
  } catch (error) {
    return next(error);
  }
}

export async function getOrderController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }
    const { id } = req.params;
    const order = await getOrderById(id, req.user.id);
    return sendResponse(res, 200, order);
  } catch (error) {
    return next(error);
  }
}

export async function cancelOrderController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }
    const { id } = req.params;
    const order = await cancelOrder(id, req.user.id);
    return sendResponse(res, 200, order);
  } catch (error) {
    return next(error);
  }
}

export async function updateOrderStatusController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }
    const { id } = req.params;
    const { orderStatus } = req.body;
    if (!orderStatus) {
      throw new ApiError(400, "Missing orderStatus parameter");
    }

    const order = await updateOrderStatusByAdmin(id, orderStatus, req.user.id);
    return sendResponse(res, 200, order);
  } catch (error) {
    return next(error);
  }
}
