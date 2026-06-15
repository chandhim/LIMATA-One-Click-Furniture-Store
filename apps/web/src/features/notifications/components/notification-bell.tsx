"use client";

import { Bell } from "lucide-react";
import { useUnreadCount } from "../hooks/use-notifications";

interface NotificationBellProps {
  onClick?: () => void;
}

export function NotificationBell({ onClick }: NotificationBellProps) {
  const unreadCount = useUnreadCount();

  return (
    <button
      onClick={onClick}
      className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
      aria-label="Notifications"
    >
      <Bell size={20} />
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </button>
  );
}
