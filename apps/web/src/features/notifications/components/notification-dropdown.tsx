"use client";

import Link from "next/link";
import {
  useNotifications,
  useMarkNotificationAsRead,
} from "../hooks/use-notifications";
import type { Notification } from "../types/notification.types";

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

function NotificationItem({
  notification,
  onMarkAsRead,
}: {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}) {
  return (
    <div
      className={`p-3 border-b border-slate-100 ${
        !notification.isRead ? "bg-blue-50" : "bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h4 className="text-sm font-medium text-slate-900">
            {notification.title}
          </h4>
          <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
          <span className="text-xs text-slate-400 mt-2 block">
            {new Date(notification.createdAt).toLocaleDateString()}
          </span>
        </div>
        {!notification.isRead && (
          <button
            onClick={() => onMarkAsRead(notification.id)}
            className="text-xs text-blue-600 hover:text-blue-700 whitespace-nowrap"
          >
            Mark as read
          </button>
        )}
      </div>
    </div>
  );
}

export function NotificationDropdown({
  isOpen,
  onClose,
}: NotificationDropdownProps) {
  const { data: notifications = [] } = useNotifications();
  const { markAsRead } = useMarkNotificationAsRead();

  if (!isOpen) return null;

  const unreadNotifications = notifications
    .filter((n) => !n.isRead)
    .slice(0, 5);

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-slate-200 z-50">
      <div className="p-4 border-b border-slate-200">
        <h3 className="font-semibold text-slate-900">Notifications</h3>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {unreadNotifications.length === 0 ? (
          <div className="p-4 text-center text-slate-400">
            <p>No new notifications</p>
          </div>
        ) : (
          unreadNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={markAsRead}
            />
          ))
        )}
      </div>

      <Link
        href="/notifications"
        onClick={onClose}
        className="block p-4 text-center text-sm text-blue-600 hover:text-blue-700 border-t border-slate-200"
      >
        View all notifications
      </Link>
    </div>
  );
}
