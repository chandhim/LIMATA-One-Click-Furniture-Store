import type { NextFunction, Request, Response } from "express";
import { ApiError } from "@/shared/errors/api-error";
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadCount,
} from "./notification.service";

function sendResponse<T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T,
) {
  res.status(statusCode).json({
    success: statusCode < 400,
    message,
    data,
  });
}

export async function getNotificationsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const notifications = await getUserNotifications(req.user.id);
    sendResponse(res, 200, "Notifications fetched successfully", {
      notifications,
    });
  } catch (error) {
    next(error);
  }
}

export async function getUnreadCountController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const count = await getUnreadCount(req.user.id);
    sendResponse(res, 200, "Unread count fetched successfully", { count });
  } catch (error) {
    next(error);
  }
}

export async function markAsReadController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const { notificationId } = req.params;

    if (!notificationId) {
      throw new ApiError(400, "Notification ID is required");
    }

    const notification = await markNotificationAsRead(notificationId);
    sendResponse(res, 200, "Notification marked as read", { notification });
  } catch (error) {
    next(error);
  }
}

export async function markAllAsReadController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const result = await markAllNotificationsAsRead(req.user.id);
    sendResponse(res, 200, "All notifications marked as read", result);
  } catch (error) {
    next(error);
  }
}
