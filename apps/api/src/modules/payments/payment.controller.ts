import type { NextFunction, Request, Response } from "express";
import { ApiError } from "@/shared/errors/api-error";
import { findOrder } from "../orders/order.repository";
import { generatePaymentHash, processPayHereNotification } from "./payment.service";

function sendResponse(res: Response, status: number, data: unknown) {
  return res.status(status).json({ success: true, message: "ok", data });
}

export async function createPaymentParamsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const { orderId } = req.body;
    if (!orderId) {
      throw new ApiError(400, "Missing orderId parameter");
    }

    const order = await findOrder(orderId);
    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    // Security check: Only the customer who placed the order can request payment parameters
    if (order.userId !== req.user.id) {
      throw new ApiError(403, "Forbidden");
    }

    if (order.paymentMethod !== "PAYHERE") {
      throw new ApiError(400, "Payment method is not PayHere for this order");
    }

    // Generate initiation hash
    // PayHere uses LKR currency by default in Sri Lanka
    const currency = "LKR";
    const paymentParams = generatePaymentHash(order.orderId, order.totalAmount, currency);

    // Fetch buyer details from the order to prefill the checkout form
    const checkoutParams = {
      ...paymentParams,
      orderId: order.orderId,
      items: `Order #${order.orderId} Checkout`,
      first_name: order.shippingName.split(" ")[0] || "Customer",
      last_name: order.shippingName.split(" ").slice(1).join(" ") || "User",
      email: order.shippingEmail,
      phone: order.shippingPhone,
      address: order.shippingAddress,
      city: order.shippingCity,
      country: "Sri Lanka",
    };

    return sendResponse(res, 200, checkoutParams);
  } catch (error) {
    return next(error);
  }
}

export async function payHereNotifyController(
  req: Request,
  res: Response,
  _next: NextFunction
) {
  try {
    // PayHere sends form-urlencoded data in POST webhook callbacks.
    // Ensure Express urlencoded parsing is active or handle raw body.
    await processPayHereNotification(req.body);
    
    // Always return HTTP 200 for PayHere webhook acknowledgements
    return res.status(200).send("OK");
  } catch (error) {
    console.error("PayHere notify error:", error);
    // Even if it fails, we can respond to PayHere or log the error
    return res.status(400).send(error instanceof Error ? error.message : "Error");
  }
}
