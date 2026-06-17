import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { ApiError } from "@/shared/errors/api-error";
import { findOrder } from "../orders/order.repository";
import { createNotification } from "../notifications/notification.service";

async function notifySellers(title: string, message: string) {
  try {
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { id: true },
    });
    for (const admin of admins) {
      await createNotification({
        userId: admin.id,
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
 
  const maskSecret = (secret: string) => {
    if (secret.length <= 8) return "****";
    return secret.slice(0, 4) + "*".repeat(secret.length - 8) + secret.slice(-4);
  };
 
  console.log("PAYHERE_HASH_GENERATION_DEBUG", JSON.stringify({
    merchantId,
    orderId,
    amount: formattedAmount,
    currency,
    merchantSecretMasked: maskSecret(merchantSecret),
    secretMd5,
    hashPayload: payload,
    hash,
  }, null, 2));
 
  return {
    merchantId,
    hash,
    amount: formattedAmount,
    currency,
  };
}
 
export function verifyPayHereSignature(body: any): boolean {
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

export async function processPayHereNotification(body: any) {
  const isValid = verifyPayHereSignature(body);
  if (!isValid) {
    throw new ApiError(400, "Invalid payment signature verification");
  }

  const { order_id, status_code, payhere_amount } = body;

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
          where: { id: item.productId },
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
        where: { id: order.id },
        data: {
          paymentStatus: "PAID",
          orderStatus: "CONFIRMED",
        },
      });

      // 3. Decrement product stocks
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
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
        select: { id: true },
      });
      if (cart) {
        await tx.cartItem.deleteMany({
          where: { cartId: cart.id },
        });
      }
    });

    // Send notifications
    await notifyCustomer(
      order.userId,
      "Payment Successful",
      `Your payment of Rs. ${order.totalAmount.toLocaleString()} for order #${order.id} was successful.`,
    );
    await notifyCustomer(
      order.userId,
      "Order Confirmed",
      `Your order #${order.id} has been confirmed.`,
    );
    await notifySellers(
      "Payment Received",
      `Payment of Rs. ${order.totalAmount.toLocaleString()} received for order #${order.id}.`,
    );
    await notifySellers(
      "Order Requires Processing",
      `Order #${order.id} is confirmed and requires processing.`,
    );

    return { status: "processed", payment: "success" };
  } else {
    // Payment Failed/Canceled/Failed processing
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "FAILED",
      },
    });

    // Send failure notifications
    await notifyCustomer(
      order.userId,
      "Payment Failed",
      `Your payment for order #${order.id} failed or was cancelled.`,
    );
    await notifySellers(
      "Payment Failed",
      `Payment failed for order #${order.id}.`,
    );

    return { status: "processed", payment: "failed" };
  }
}
