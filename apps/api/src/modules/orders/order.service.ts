import { prisma } from "@/lib/prisma";
import type { OrderStatus } from "@prisma/client";
import { ApiError } from "@/shared/errors/api-error";
import type { CreateOrderInput } from "./order.validation";
import { findOrders, findOrder, updateOrder } from "./order.repository";
import { createNotification } from "../notifications/notification.service";

// Notify all Admins (acting as sellers)
async function notifySellers(title: string, message: string) {
  try {
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { userId: true },
    });
    for (const admin of admins) {
      await createNotification({
        userId: admin.userId,
        type: "SELLER_ORDER_ALERT",
        title,
        message,
      });
    }
  } catch (error) {
    console.error("Failed to notify sellers:", error);
  }
}

// Notify a single customer
async function notifyCustomer(userId: string, title: string, message: string) {
  try {
    await createNotification({
      userId,
      type: "CUSTOMER_ORDER_ALERT",
      title,
      message,
    });
  } catch (error) {
    console.error(`Failed to notify customer ${userId}:`, error);
  }
}

export async function placeOrder(userId: string, input: CreateOrderInput) {
  // 1. Fetch user cart
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, "Your cart is empty");
  }

  // 2. Validate stock availability and calculate backend pricing
  let totalAmount = 0;
  for (const item of cart.items) {
    if (!item.product) {
      throw new ApiError(404, `Product for item ${item.productId} not found`);
    }
    if (item.product.stock < item.quantity) {
      throw new ApiError(
        400,
        `Insufficient stock for product "${item.product.name}"`,
      );
    }
    totalAmount += item.product.price * item.quantity;
  }

  // 3. Execute database transaction
  const order = await prisma.$transaction(async (tx) => {
    // A. Create the Order
    const createdOrder = await tx.order.create({
      data: {
        userId,
        paymentMethod: input.paymentMethod,
        paymentStatus: input.paymentMethod === "COD" ? "UNPAID" : "PENDING",
        orderStatus: "PENDING",
        totalAmount,
        shippingName: input.shippingName,
        shippingEmail: input.shippingEmail,
        shippingPhone: input.shippingPhone,
        shippingAddress: input.shippingAddress,
        shippingCity: input.shippingCity,
        deliveryMethod: input.deliveryMethod,
      },
    });

    // B. Create the Order Items
    for (const item of cart.items) {
      await tx.orderItem.create({
        data: {
          orderId: createdOrder.orderId,
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        },
      });
    }

    // C. COD Flow specific database writes (stock dec + clear cart)
    if (input.paymentMethod === "COD") {
      // Reduce stock
      for (const item of cart.items) {
        await tx.product.update({
          where: { productId: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.cartId },
      });
    }

    return createdOrder;
  });

  // 4. Send initial notifications
  if (input.paymentMethod === "COD") {
    await notifyCustomer(
      userId,
      "Order Placed",
      `Your COD order #${order.orderId} has been placed. Total amount is Rs. ${totalAmount.toLocaleString()}.`,
    );
    await notifySellers(
      "New Order",
      `New COD order #${order.orderId} received from ${input.shippingName} for Rs. ${totalAmount.toLocaleString()}.`,
    );
    await notifySellers(
      "Order Requires Processing",
      `COD order #${order.orderId} is pending processing.`,
    );
  } else {
    // PayHere
    await notifyCustomer(
      userId,
      "Order Placed",
      `Your order #${order.orderId} has been created. Total amount is Rs. ${totalAmount.toLocaleString()}.`,
    );
    await notifyCustomer(
      userId,
      "Payment Initiated",
      `Payment checkout page loaded for order #${order.orderId}.`,
    );
    await notifySellers(
      "New Order",
      `New order #${order.orderId} initiated (PayHere) by ${input.shippingName} for Rs. ${totalAmount.toLocaleString()}.`,
    );
  }

  return order;
}

export async function getUserOrders(userId: string) {
  const user = await prisma.user.findUnique({
    where: { userId },
    select: { role: true },
  });

  if (user?.role === "ADMIN") {
    return prisma.order.findMany({
      include: {
        items: {
          include: {
            product: {
              select: {
                productId: true,
                name: true,
                price: true,
                images: true,
              },
            },
          },
          orderBy: { orderItemId: "asc" },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  return findOrders(userId);
}

export async function getOrderById(orderId: string, userId: string) {
  const order = await findOrder(orderId);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Authorization check: Only owner or admin can view order
  if (order.userId !== userId) {
    const user = await prisma.user.findUnique({
      where: { userId },
      select: { role: true },
    });
    if (user?.role !== "ADMIN") {
      throw new ApiError(403, "Forbidden");
    }
  }

  return order;
}

export async function cancelOrder(orderId: string, userId: string) {
  const order = await findOrder(orderId);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Authorization check
  if (order.userId !== userId) {
    const user = await prisma.user.findUnique({
      where: { userId },
      select: { role: true },
    });
    if (user?.role !== "ADMIN") {
      throw new ApiError(403, "Forbidden");
    }
  }

  // Status check: Allow PENDING or CONFIRMED only
  const validStatusForCancellation = ["PENDING", "CONFIRMED"];
  if (!validStatusForCancellation.includes(order.orderStatus)) {
    throw new ApiError(
      400,
      `Cannot cancel order in its current status: ${order.orderStatus}`,
    );
  }

  if (order.paymentMethod === "COD") {
    // COD -> CANCELLED
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { orderId },
        data: {
          orderStatus: "CANCELLED",
        },
      });

      // Restore stock (since COD decs stock at checkout)
      for (const item of order.items) {
        await tx.product.update({
          where: { productId: item.productId },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }
    });

    await notifyCustomer(
      order.userId,
      "Order Cancelled",
      `Your COD order #${order.orderId} has been cancelled.`,
    );
    await notifySellers(
      "Order Cancelled",
      `COD order #${order.orderId} has been cancelled by the user.`,
    );
  } else {
    // PayHere -> CANCELLATION_REQUESTED
    await updateOrder(orderId, {
      orderStatus: "CANCELLATION_REQUESTED",
    });

    await notifyCustomer(
      order.userId,
      "Cancellation Requested",
      `Cancellation request received for PayHere order #${order.orderId}.`,
    );
    await notifySellers(
      "Cancellation Requested",
      `Customer requested cancellation for PayHere order #${order.orderId}.`,
    );
  }

  return findOrder(orderId);
}

export async function updateOrderStatusByAdmin(
  orderId: string,
  newStatus: OrderStatus,
  adminUserId: string,
) {
  // Confirm user is Admin
  const admin = await prisma.user.findUnique({
    where: { userId: adminUserId },
    select: { role: true },
  });
  if (admin?.role !== "ADMIN") {
    throw new ApiError(403, "Only admins can update order states");
  }

  const order = await findOrder(orderId);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  const updatedOrder = await updateOrder(orderId, { orderStatus: newStatus });

  // Custom status notifications mapping
  const statusLabels: Record<string, string> = {
    CONFIRMED: "Order Confirmed",
    PROCESSING: "Processing",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
  };

  const statusLabel = statusLabels[newStatus] || newStatus;
  await notifyCustomer(
    order.userId,
    statusLabel,
    `Your order #${order.orderId} status is now ${newStatus}.`,
  );

  return updatedOrder;
}
