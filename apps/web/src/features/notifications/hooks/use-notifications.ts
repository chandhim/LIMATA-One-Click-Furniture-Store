"use client";

import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/providers/socket-provider";
import {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../api/notification.api";

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useUnreadCount() {
  const queryClient = useQueryClient();
  const [unreadCount, setUnreadCount] = useState(0);
  const { socket } = useSocket();

  const { data: initialCount } = useQuery({
    queryKey: ["unreadCount"],
    queryFn: getUnreadCount,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  useEffect(() => {
    if (initialCount !== undefined) {
      setUnreadCount(initialCount);
    }
  }, [initialCount]);

  useEffect(() => {
    if (!socket) return;

    socket.on("notification", () => {
      setUnreadCount((prev) => prev + 1);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadCount"] });
    });

    return () => {
      socket.off("notification");
    };
  }, [socket, queryClient]);

  return unreadCount;
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  const markAsRead = async (notificationId: string) => {
    await markNotificationAsRead(notificationId);
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
    queryClient.invalidateQueries({ queryKey: ["unreadCount"] });
  };

  return { markAsRead };
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  const markAllAsRead = async () => {
    await markAllNotificationsAsRead();
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
    queryClient.invalidateQueries({ queryKey: ["unreadCount"] });
  };

  return { markAllAsRead };
}
