import type { Conversation, Message } from "@prisma/client";
import { ApiError } from "@/shared/errors/api-error";
import {
  findConversationById,
  findConversationsByCustomerId,
  createConversation,
  createMessage,
  getConversationMessages,
  getAllConversations,
} from "./chat.repository";

export async function getCustomerConversations(customerId: string): Promise<Conversation[]> {
  return findConversationsByCustomerId(customerId);
}

export async function getAdminConversations(): Promise<Conversation[]> {
  return getAllConversations();
}

export async function startConversation(customerId: string): Promise<Conversation> {
  // Check if customer already has an existing conversation
  const existingConversation = await findConversationsByCustomerId(customerId);

  if (existingConversation.length > 0) {
    throw new ApiError(400, "Customer already has an active conversation");
  }

  return createConversation(customerId);
}

export async function sendMessage(data: {
  conversationId: string;
  senderId: string;
  content: string;
}): Promise<Message> {
  const conversation = await findConversationById(data.conversationId);

  if (!conversation) {
    throw new ApiError(404, "Conversation not found");
  }

  if (!data.content || data.content.trim() === "") {
    throw new ApiError(400, "Message content cannot be empty");
  }

  return createMessage({
    conversationId: data.conversationId,
    senderId: data.senderId,
    content: data.content.trim(),
  });
}

export async function getConversationDetail(conversationId: string): Promise<Conversation | null> {
  return findConversationById(conversationId);
}

export async function getMessages(
  conversationId: string,
  skip?: number,
  take?: number,
): Promise<Message[]> {
  return getConversationMessages(conversationId, skip, take);
}
