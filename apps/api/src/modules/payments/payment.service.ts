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
  // Generate the MD5 hash required by PayHere to securely initiate a payment session from the client
  // The hash prevents tampering with the order amount and ID during the checkout redirect
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

// Verifies the authenticity of server-to-server notifications sent by PayHere (webhook payload)
// It recalculates the MD5 signature using the secret and compares it to the provided md5sig
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

  // Look for the CheckoutAttempt
  const attempt = await prisma.checkoutAttempt.findUnique({
    where: { attemptId: order_id },
    include: { items: true }
  });

  const statusCodeNum = parseInt(status_code, 10);

  if (!attempt) {
    // If not found in attempts, it might already be an Order (e.g. processed by client-side confirm)
    const existingOrder = await findOrder(order_id);
    if (existingOrder) {
      if (existingOrder.paymentStatus === "PAID") {
        return { status: "ignored", reason: "order already paid and migrated" };
      }
      
      // Edge case: If it exists in Order table but payment failed/refunded?
      if (statusCodeNum !== 2) {
        await prisma.order.update({
          where: { orderId: existingOrder.orderId },
          data: { paymentStatus: "FAILED" },
        });
        return { status: "processed", payment: "failed_existing" };
      }
    }
    throw new ApiError(404, `CheckoutAttempt ${order_id} not found`);
  }

  if (statusCodeNum === 2) {
    // Payment Success -> Migrate CheckoutAttempt to Order
    await prisma.$transaction(async (tx) => {
      // 1. Double check stock for final checkout
      for (const item of attempt.items) {
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

      // 2. Create Order
      await tx.order.create({
        data: {
          orderId: attempt.attemptId,
          userId: attempt.userId,
          paymentMethod: attempt.paymentMethod,
          paymentStatus: "PAID",
          orderStatus: "ACCEPTED",
          totalAmount: attempt.totalAmount,
          shippingName: attempt.shippingName,
          shippingEmail: attempt.shippingEmail,
          shippingPhone: attempt.shippingPhone,
          shippingAddress: attempt.shippingAddress,
          shippingCity: attempt.shippingCity,
          deliveryMethod: attempt.deliveryMethod,
          deliveryCharge: attempt.deliveryCharge,
          items: {
            create: attempt.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price
            }))
          }
        }
      });

      // 3. Decrement product stocks
      for (const item of attempt.items) {
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
        where: { userId: attempt.userId },
        select: { cartId: true },
      });
      if (cart) {
        await tx.cartItem.deleteMany({
          where: { cartId: cart.cartId },
        });
      }
      
      // 5. Delete CheckoutAttempt
      await tx.checkoutAttempt.delete({
        where: { attemptId: attempt.attemptId }
      });
    });

    // Send notifications
    await notifyCustomer(
      attempt.userId,
      "Payment Successful",
      `Your payment of Rs. ${attempt.totalAmount.toLocaleString()} for order #${attempt.attemptId} was successful.`,
    );
    await notifyCustomer(
      attempt.userId,
      "Order Confirmed",
      `Your order #${attempt.attemptId} has been confirmed.`,
    );
    await notifySellers(
      "Payment Received",
      `Payment of Rs. ${attempt.totalAmount.toLocaleString()} received for order #${attempt.attemptId}.`,
    );
    await notifySellers(
      "Order Requires Processing",
      `Order #${attempt.attemptId} is confirmed and requires processing.`,
    );

    return { status: "processed", payment: "success" };
  } else {
    // Payment Failed/Canceled/Failed processing
    // Update CheckoutAttempt paymentStatus
    await prisma.checkoutAttempt.update({
      where: { attemptId: attempt.attemptId },
      data: {
        paymentStatus: "FAILED",
      },
    });

    // Send failure notifications
    await notifyCustomer(
      attempt.userId,
      "Payment Failed",
      `Your payment for checkout #${attempt.attemptId} failed or was cancelled.`,
    );
    await notifySellers(
      "Payment Failed",
      `Payment failed for checkout #${attempt.attemptId}.`,
    );

    return { status: "processed", payment: "failed" };
  }
}
