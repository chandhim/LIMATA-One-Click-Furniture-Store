import type { NextFunction, Request, Response } from "express";
import { ApiError } from "@/shared/errors/api-error";
import { Role } from "@prisma/client";
import {
  getCustomerConversations,
  getAdminConversations,
  startConversation,
  getConversationDetail,
  getMessages,
} from "./chat.service";

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

export async function getConversationsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    let conversations;

    if (req.user.role === Role.ADMIN) {
      conversations = await getAdminConversations();
    } else {
      conversations = await getCustomerConversations(req.user.id);
    }

    sendResponse(res, 200, "Conversations fetched successfully", {
      conversations,
    });
  } catch (error) {
    next(error);
  }
}

export async function startConversationController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    if (req.user.role === Role.ADMIN) {
      throw new ApiError(403, "Admins cannot start conversations");
    }

    const conversation = await startConversation(req.user.id);
    sendResponse(res, 201, "Conversation started successfully", {
      conversation,
    });
  } catch (error) {
    next(error);
  }
}

export async function getConversationController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const { conversationId } = req.params;

    if (!conversationId) {
      throw new ApiError(400, "Conversation ID is required");
    }

    const conversation = await getConversationDetail(conversationId);

    if (!conversation) {
      throw new ApiError(404, "Conversation not found");
    }

    // Verify access: customer can only view their own conversation
    if (req.user.role === Role.CUSTOMER && conversation.customerId !== req.user.id) {
      throw new ApiError(403, "Access denied");
    }

    sendResponse(res, 200, "Conversation fetched successfully", {
      conversation,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMessagesController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const { conversationId } = req.params;
    const skip = Number(req.query.skip) || 0;
    const take = Number(req.query.take) || 50;

    if (!conversationId) {
      throw new ApiError(400, "Conversation ID is required");
    }

    const messages = await getMessages(conversationId, skip, take);

    sendResponse(res, 200, "Messages fetched successfully", {
      messages,
    });
  } catch (error) {
    next(error);
  }
}
