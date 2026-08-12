import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import {
  getConversationsController,
  startConversationController,
  getConversationController,
  getMessagesController,
} from "./chat.controller";

export const chatRouter = Router();

chatRouter.use(authenticate);

chatRouter.get("/conversations", getConversationsController);
chatRouter.post("/conversations/start", startConversationController);
chatRouter.get("/conversations/:conversationId", getConversationController);
chatRouter.get(
  "/conversations/:conversationId/messages",
  getMessagesController,
);
