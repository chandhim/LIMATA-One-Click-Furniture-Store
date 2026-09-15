import { prisma } from "@/lib/prisma";
import type { OrderStatus } from "@prisma/client";
import { ApiError } from "@/shared/errors/api-error";
import type { CreateOrderInput } from "./order.validation";
import { findOrders, findOrder, updateOrder } from "./order.repository";
import { createNotification } from "../notifications/notification.service";
import { deliveryService } from "../delivery/delivery.service";

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
  let subtotal = 0;
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
    subtotal += item.product.price * item.quantity;
  }

  const deliveryCharge = await deliveryService.calculateCharge(input.deliveryMethod, subtotal);
  const totalAmount = subtotal + deliveryCharge;

  // 3. Execute database transaction
  const result = await prisma.$transaction(async (tx) => {
    if (input.paymentMethod === "COD") {
      // Create ACCEPTED order directly
      const createdOrder = await tx.order.create({
        data: {
          userId,
          paymentMethod: "COD",
          paymentStatus: "UNPAID",
          orderStatus: "ACCEPTED",
          totalAmount,
          shippingName: input.shippingName,
          shippingEmail: input.shippingEmail,
          shippingPhone: input.shippingPhone,
          shippingAddress: input.shippingAddress,
          shippingCity: input.shippingCity,
          deliveryMethod: input.deliveryMethod,
          deliveryCharge,
          items: {
            create: cart.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            }))
          }
        },
      });

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

      return { type: 'ORDER', data: createdOrder };
    } else {
      // PayHere: Create a CheckoutAttempt, not an Order!
      const attempt = await tx.checkoutAttempt.create({
        data: {
          userId,
          paymentMethod: "PAYHERE",
          paymentStatus: "PENDING",
          totalAmount,
          shippingName: input.shippingName,
          shippingEmail: input.shippingEmail,
          shippingPhone: input.shippingPhone,
          shippingAddress: input.shippingAddress,
          shippingCity: input.shippingCity,
          deliveryMethod: input.deliveryMethod,
          deliveryCharge,
          items: {
            create: cart.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            }))
          }
        }
      });
      // Do NOT reduce stock or clear cart yet.
      return { type: 'ATTEMPT', data: attempt };
    }
  });

  // 4. Send initial notifications
  if (result.type === 'ORDER') {
    const order = result.data;
    await notifyCustomer(
      userId,
      "Order Placed",
      `Your COD order #${order.orderId} has been placed. Total amount is Rs. ${totalAmount.toLocaleString()}.`,
    );
    await notifySellers(
      "New Order",
      `New COD order #${order.orderId} received from ${input.shippingName} for Rs. ${totalAmount.toLocaleString()}.`,
    );
    
    // Return order matching expected interface
    return order;
  } else {
    const attempt = result.data;
    await notifyCustomer(
      userId,
      "Payment Initiated",
      `Payment checkout page loaded for attempt #${attempt.attemptId}.`,
    );
    
    // Return attempt, mocking the orderId property for the frontend compatibility during checkout
    return { ...attempt, orderId: attempt.attemptId };
  }
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
  let order: any = await findOrder(orderId);
  if (!order) {
    // Fallback to check if it's an abandoned checkout attempt
    const attempt = await prisma.checkoutAttempt.findUnique({
      where: { attemptId: orderId },
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
          orderBy: { attemptItemId: "asc" },
        },
      },
    });

    if (!attempt) {
      throw new ApiError(404, "Order not found");
    }
    
    // Mock it as an Order for the frontend to render the payment page
    order = {
      ...attempt,
      orderId: attempt.attemptId,
      orderStatus: "PAYMENT_PENDING", // Treated specially by the frontend
      items: attempt.items.map((item: any) => ({
        ...item,
        orderItemId: item.attemptItemId,
      }))
    };
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

  // Status check: Allow ACCEPTED only
  if (order.orderStatus !== "ACCEPTED") {
    throw new ApiError(
      400,
      `Cannot cancel order in its current status: ${order.orderStatus}. Please contact support if you need to cancel a shipped order.`,
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { orderId },
      data: {
        orderStatus: "CANCELLED",
      },
    });

    // Restore stock for both COD and PayHere
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
    `Your order #${order.orderId} has been cancelled.`,
  );
  await notifySellers(
    "Order Cancelled",
    `Order #${order.orderId} has been cancelled by the user.`,
  );

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
  
  // Transition Logic Matrix Enforced
  const isValidTransition = 
    (order.orderStatus === "ACCEPTED" && newStatus === "SHIPPED") ||
    (order.orderStatus === "ACCEPTED" && newStatus === "CANCELLED") ||
    (order.orderStatus === "SHIPPED" && newStatus === "DELIVERED");
    
  if (!isValidTransition) {
    throw new ApiError(400, `Invalid state transition from ${order.orderStatus} to ${newStatus}`);
  }
  
  // Extra Validation for PayHere
  if (newStatus === "SHIPPED" && order.paymentMethod === "PAYHERE" && order.paymentStatus !== "PAID") {
    throw new ApiError(400, `Cannot ship PayHere order that is not PAID`);
  }

  let updatedOrder;
  
  await prisma.$transaction(async (tx) => {
    let paymentStatus = order.paymentStatus;
    
    // Atomic update for COD upon delivery
    if (newStatus === "DELIVERED" && order.paymentMethod === "COD") {
      paymentStatus = "PAID";
    }
    
    updatedOrder = await tx.order.update({
      where: { orderId },
      data: { 
        orderStatus: newStatus,
        paymentStatus
      },
      include: {
        items: true,
        user: true
      }
    });
    
    // Restore stock if Admin Cancels an ACCEPTED order
    if (newStatus === "CANCELLED" && order.orderStatus === "ACCEPTED") {
      for (const item of order.items) {
        await tx.product.update({
          where: { productId: item.productId },
          data: { stock: { increment: item.quantity } }
        });
      }
    }
  });

  const statusLabel = newStatus;
  await notifyCustomer(
    order.userId,
    statusLabel,
    `Your order #${order.orderId} status is now ${newStatus}.`,
  );

  return updatedOrder;
}

export async function deleteDraftOrder(orderId: string, userId: string) {
  // This function used to delete PENDING PayHere orders.
  // Now, those are CheckoutAttempt records. We will try deleting the checkout attempt.
  const attempt = await prisma.checkoutAttempt.findUnique({
    where: { attemptId: orderId }
  });
  
  if (!attempt) {
    // Legacy support or already deleted
    return { success: true };
  }

  // Authorization check
  if (attempt.userId !== userId) {
    const user = await prisma.user.findUnique({
      where: { userId },
      select: { role: true },
    });
    if (user?.role !== "ADMIN") {
      throw new ApiError(403, "Forbidden");
    }
  }

  await prisma.$transaction(async (tx) => {
    await tx.checkoutAttemptItem.deleteMany({
      where: { attemptId: orderId },
    });
    await tx.checkoutAttempt.delete({
      where: { attemptId: orderId },
    });
  });

  return { success: true };
}

export async function confirmPayherePaymentClientSide(orderId: string, userId: string) {
  // orderId here is the CheckoutAttempt ID.
  const attempt = await prisma.checkoutAttempt.findUnique({
    where: { attemptId: orderId },
    include: { items: true }
  });
  
  if (!attempt) {
    // If not found in attempts, it might already be a fully processed Order.
    const order = await findOrder(orderId);
    if (order) return order;
    
    throw new ApiError(404, "Checkout attempt not found");
  }

  // Ensure user owns the attempt
  if (attempt.userId !== userId) {
    throw new ApiError(403, "Forbidden");
  }

  let finalOrder;

  // Perform the conversion from CheckoutAttempt -> Order
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

    // 2. Create the final ACCEPTED Order (reusing the attemptId as orderId)
    finalOrder = await tx.order.create({
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
    
    // 5. Delete the CheckoutAttempt
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
    "Order Accepted",
    `Your order #${attempt.attemptId} has been successfully placed.`,
  );
  await notifySellers(
    "Payment Received & Order Placed",
    `Payment of Rs. ${attempt.totalAmount.toLocaleString()} received for new order #${attempt.attemptId}.`,
  );

  return finalOrder;
}
