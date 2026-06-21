import type { Conversation, Message } from "@prisma/client";
import { ApiError } from "@/shared/errors/api-error";
import { prisma } from "@/lib/prisma";
import {
  findConversationById,
  findConversationsByCustomerId,
  createConversation,
  createMessage,
  getConversationMessages,
  getAllConversations,
} from "./chat.repository";

export async function getCustomerConversations(customerId: string): Promise<Record<string, unknown>[]> {
  const conversations = await findConversationsByCustomerId(customerId);
  const customer = await prisma.user.findUnique({
    where: { userId: customerId },
    select: { userId: true, name: true, email: true },
  });

  return conversations.map((c) => ({
    ...c,
    customer,
  }));
}

export async function getAdminConversations(): Promise<Record<string, unknown>[]> {
  const conversations = await getAllConversations();
  const customerIds = conversations.map((c) => c.customerId);

  const customers = await prisma.user.findMany({
    where: { userId: { in: customerIds } },
    select: { userId: true, name: true, email: true },
  });

  const customerMap = new Map(customers.map((c) => [c.userId, c]));

  return conversations.map((c) => ({
    ...c,
    customer: customerMap.get(c.customerId) || null,
  }));
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

export async function getConversationDetail(conversationId: string): Promise<Record<string, unknown> | null> {
  const conversation = await findConversationById(conversationId);
  if (!conversation) return null;

  const customer = await prisma.user.findUnique({
    where: { userId: conversation.customerId },
    select: { userId: true, name: true, email: true },
  });

  return {
    ...conversation,
    customer,
  };
}

export async function getMessages(
  conversationId: string,
  skip?: number,
  take?: number,
): Promise<Message[]> {
  return getConversationMessages(conversationId, skip, take);
}
