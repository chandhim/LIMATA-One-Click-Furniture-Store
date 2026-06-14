export type NotificationType = "CHAT_MESSAGE" | "ORDER_STATUS" | "PAYMENT_STATUS" | "REVIEW_STATUS" | "SYSTEM" | "AI_RECOMMENDATION";

export type Notification = {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type GetNotificationsResponse = {
  notifications: Notification[];
};

export type GetUnreadCountResponse = {
  count: number;
};

export type MarkAsReadResponse = {
  notification: Notification;
};

export type MarkAllAsReadResponse = {
  count: number;
};
