import { prisma } from "@/lib/prisma";
import type { OrderStatus, PaymentStatus } from "@prisma/client";

const orderInclude = {
  items: {
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          images: true,
        },
      },
    },
    orderBy: { id: "asc" as const },
  },
};

export async function findOrders(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: orderInclude,
    orderBy: { createdAt: "desc" },
  });
}

export async function findOrder(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: orderInclude,
  });
}

export async function updateOrder(
  id: string,
  data: {
    orderStatus?: OrderStatus;
    paymentStatus?: PaymentStatus;
  }
) {
  return prisma.order.update({
    where: { id },
    data,
    include: orderInclude,
  });
}
