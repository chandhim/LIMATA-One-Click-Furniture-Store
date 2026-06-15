import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import {
  getNotificationsController,
  getUnreadCountController,
  markAsReadController,
  markAllAsReadController,
} from "./notification.controller";

export const notificationRouter = Router();

notificationRouter.use(authenticate);

notificationRouter.get("/", getNotificationsController);
notificationRouter.get("/unread-count", getUnreadCountController);
notificationRouter.patch("/:notificationId/read", markAsReadController);
notificationRouter.patch("/mark-all-read", markAllAsReadController);
