import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { ApiError } from "@/shared/errors/api-error";
import { findOrder } from "../orders/order.repository";
import { createNotification } from "../notifications/notification.service";

async function notifySellers(title: string, message: string) {
  try {
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { userId: true },
    });
    for (const admin of admins) {
      await createNotification({
        userId: admin.userId,
        type: "SELLER_PAYMENT_ALERT",
        title,
        message,
      });
    }
  } catch (error) {
    console.error("Failed to notify sellers:", error);
  }
}

async function notifyCustomer(userId: string, title: string, message: string) {
  try {
    await createNotification({
      userId,
      type: "CUSTOMER_PAYMENT_ALERT",
      title,
      message,
    });
  } catch (error) {
    console.error(`Failed to notify customer ${userId}:`, error);
  }
}

export function generatePaymentHash(
  orderId: string,
  amount: number,
  currency: string,
) {
  const merchantId = process.env.PAYHERE_MERCHANT_ID || "1236345";
  const merchantSecret =
    process.env.PAYHERE_MERCHANT_SECRET ||
    "NzYwODc2MTk3MzIyMDMxMzkxMDgwNjU1MTU1OTMyOTAzNzMxMzk=";

  const formattedAmount = amount.toFixed(2);
  const secretMd5 = crypto
    .createHash("md5")
    .update(merchantSecret)
    .digest("hex")
    .toUpperCase();

  const payload = merchantId + orderId + formattedAmount + currency + secretMd5;
  const hash = crypto
    .createHash("md5")
    .update(payload)
    .digest("hex")
    .toUpperCase();

  return {
    merchantId,
    hash,
    amount: formattedAmount,
    currency,
  };
}

interface PayHereNotification {
  merchant_id?: string;
  order_id?: string;
  payhere_amount?: string;
  payhere_currency?: string;
  status_code?: string;
  md5sig?: string;
  [key: string]: unknown;
}

export function verifyPayHereSignature(body: PayHereNotification): boolean {
  const merchantId = process.env.PAYHERE_MERCHANT_ID || "1236345";
  const merchantSecret =
    process.env.PAYHERE_MERCHANT_SECRET ||
    "NzYwODc2MTk3MzIyMDMxMzkxMDgwNjU1MTU1OTMyOTAzNzMxMzk=";

  const {
    merchant_id,
    order_id,
    payhere_amount,
    payhere_currency,
    status_code,
    md5sig,
  } = body;

  if (merchant_id !== merchantId) {
    console.warn(
      "PayHere notification verification failed: merchant_id mismatch.",
    );
    return false;
  }

  const secretMd5 = crypto
    .createHash("md5")
    .update(merchantSecret)
    .digest("hex")
    .toUpperCase();
  const payload =
    merchant_id +
    order_id +
    payhere_amount +
    payhere_currency +
    status_code +
    secretMd5;
  const calculatedSig = crypto
    .createHash("md5")
    .update(payload)
    .digest("hex")
    .toUpperCase();

  return calculatedSig === md5sig?.toUpperCase();
}

export async function processPayHereNotification(body: PayHereNotification) {
  const isValid = verifyPayHereSignature(body);
  if (!isValid) {
    throw new ApiError(400, "Invalid payment signature verification");
  }

  const { order_id, status_code, payhere_amount: _payhere_amount } = body;

  if (!order_id || !status_code) {
    throw new ApiError(400, "Missing required fields in payment notification");
  }

  // Retrieve the order details
  const order = await findOrder(order_id);
  if (!order) {
    throw new ApiError(404, `Order ${order_id} not found`);
  }

  // Idempotency: if already paid, skip reprocessing
  if (order.paymentStatus === "PAID") {
    return { status: "ignored", reason: "order already paid" };
  }

  const statusCodeNum = parseInt(status_code, 10);

  if (statusCodeNum === 2) {
    // Payment Success
    await prisma.$transaction(async (tx) => {
      // 1. Double check stock for final checkout
      for (const item of order.items) {
        const product = await tx.product.findUnique({
          where: { productId: item.productId },
          select: { stock: true, name: true },
        });
        if (!product || product.stock < item.quantity) {
          throw new ApiError(
            400,
            `Stock check failed for "${product?.name || item.productId}" during payment settlement.`,
          );
        }
      }

      // 2. Update order statuses
      await tx.order.update({
        where: { orderId: order.orderId },
        data: {
          paymentStatus: "PAID",
          orderStatus: "CONFIRMED",
        },
      });

      // 3. Decrement product stocks
      for (const item of order.items) {
        await tx.product.update({
          where: { productId: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // 4. Clear User Cart
      const cart = await tx.cart.findUnique({
        where: { userId: order.userId },
        select: { cartId: true },
      });
      if (cart) {
        await tx.cartItem.deleteMany({
          where: { cartId: cart.cartId },
        });
      }
    });

    // Send notifications
    await notifyCustomer(
      order.userId,
      "Payment Successful",
      `Your payment of Rs. ${order.totalAmount.toLocaleString()} for order #${order.orderId} was successful.`,
    );
    await notifyCustomer(
      order.userId,
      "Order Confirmed",
      `Your order #${order.orderId} has been confirmed.`,
    );
    await notifySellers(
      "Payment Received",
      `Payment of Rs. ${order.totalAmount.toLocaleString()} received for order #${order.orderId}.`,
    );
    await notifySellers(
      "Order Requires Processing",
      `Order #${order.orderId} is confirmed and requires processing.`,
    );

    return { status: "processed", payment: "success" };
  } else {
    // Payment Failed/Canceled/Failed processing
    await prisma.order.update({
      where: { orderId: order.orderId },
      data: {
        paymentStatus: "FAILED",
      },
    });

    // Send failure notifications
    await notifyCustomer(
      order.userId,
      "Payment Failed",
      `Your payment for order #${order.orderId} failed or was cancelled.`,
    );
    await notifySellers(
      "Payment Failed",
      `Payment failed for order #${order.orderId}.`,
    );

    return { status: "processed", payment: "failed" };
  }
}
