import api from "@/lib/axios";
import type {
  Notification,
  GetNotificationsResponse,
  GetUnreadCountResponse,
  MarkAsReadResponse,
  MarkAllAsReadResponse,
} from "../types/notification.types";

export async function getNotifications(): Promise<Notification[]> {
  try {
    const response = await api.get<{
      success: boolean;
      data: GetNotificationsResponse;
    }>("/notifications");
    return response.data.data.notifications;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to get notifications",
    );
  }
}

export async function getUnreadCount(): Promise<number> {
  try {
    const response = await api.get<{
      success: boolean;
      data: GetUnreadCountResponse;
    }>("/notifications/unread-count");
    return response.data.data.count;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to get unread count",
    );
  }
}

export async function markNotificationAsRead(
  notificationId: string,
): Promise<Notification> {
  try {
    const response = await api.patch<{
      success: boolean;
      data: MarkAsReadResponse;
    }>(`/notifications/${notificationId}/read`);
    return response.data.data.notification;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to mark notification as read",
    );
  }
}

export async function markAllNotificationsAsRead(): Promise<number> {
  try {
    const response = await api.patch<{
      success: boolean;
      data: MarkAllAsReadResponse;
    }>("/notifications/mark-all-read");
    return response.data.data.count;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to mark all notifications as read",
    );
  }
}
