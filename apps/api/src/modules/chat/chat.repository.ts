import { prisma } from "@/lib/prisma";
import type { Conversation, Message } from "@prisma/client";

export async function findConversationById(id: string): Promise<Conversation | null> {
  return prisma.conversation.findUnique({
    where: { id },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });
}

export async function findConversationsByCustomerId(customerId: string): Promise<Conversation[]> {
  return prisma.conversation.findMany({
    where: { customerId },
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function createConversation(customerId: string): Promise<Conversation> {
  return prisma.conversation.create({
    data: { customerId },
  });
}

export async function createMessage(data: {
  conversationId: string;
  senderId: string;
  content: string;
}): Promise<Message> {
  const message = await prisma.message.create({
    data,
  });

  // Update conversation's updatedAt timestamp
  await prisma.conversation.update({
    where: { id: data.conversationId },
    data: { updatedAt: new Date() },
  });

  return message;
}

export async function getConversationMessages(
  conversationId: string,
  skip: number = 0,
  take: number = 50,
): Promise<Message[]> {
  return prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "desc" },
    skip,
    take,
  });
}

export async function getAllConversations(): Promise<Conversation[]> {
  return prisma.conversation.findMany({
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getConversationWithMessages(conversationId: string) {
  return prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
}
