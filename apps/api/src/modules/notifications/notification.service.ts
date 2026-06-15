import { prisma } from "@/lib/prisma";
import type { Notification } from "@prisma/client";

export type CreateNotificationInput = {
  userId: string;
  type: string;
  title: string;
  message: string;
};

export async function createNotification(input: CreateNotificationInput): Promise<Notification> {
  return prisma.notification.create({
    data: input,
  });
}

export async function getUserNotifications(userId: string): Promise<Notification[]> {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function markNotificationAsRead(notificationId: string): Promise<Notification> {
  return prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
}

export async function markAllNotificationsAsRead(userId: string): Promise<{ count: number }> {
  const result = await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });

  return { count: result.count };
}

export async function getUnreadCount(userId: string): Promise<number> {
  return prisma.notification.count({
    where: { userId, isRead: false },
  });
}

export async function deleteNotification(notificationId: string): Promise<Notification> {
  return prisma.notification.delete({
    where: { id: notificationId },
  });
}

export async function getNotificationById(notificationId: string): Promise<Notification | null> {
  return prisma.notification.findUnique({
    where: { id: notificationId },
  });
}
