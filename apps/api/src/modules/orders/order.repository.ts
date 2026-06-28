import { prisma } from "@/lib/prisma";
import type { OrderStatus, PaymentStatus } from "@prisma/client";

const orderInclude = {
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
    orderBy: { orderItemId: "asc" as const },
  },
};

export async function findOrders(userId: string) {
  return prisma.order.findMany({
    where: { 
      userId,
      NOT: {
        paymentMethod: "PAYHERE",
        paymentStatus: "PENDING",
      }
    },
    include: orderInclude,
    orderBy: { createdAt: "desc" },
  });
}

export async function findOrder(orderId: string) {
  return prisma.order.findUnique({
    where: { orderId },
    include: orderInclude,
  });
}

export async function updateOrder(
  orderId: string,
  data: {
    orderStatus?: OrderStatus;
    paymentStatus?: PaymentStatus;
  },
) {
  return prisma.order.update({
    where: { orderId },
    data,
    include: orderInclude,
  });
}
