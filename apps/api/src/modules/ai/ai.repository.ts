import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function createAiConversation(userId: string, title?: string) {
  return prisma.aiConversation.create({
    data: {
      userId,
      title,
    },
  });
}

export async function getAiConversationById(aiConversationId: string, userId: string) {
  return prisma.aiConversation.findFirst({
    where: {
      aiConversationId,
      userId, // Ensure ownership
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
}

export async function getUserAiConversations(userId: string) {
  return prisma.aiConversation.findMany({
    where: {
      userId,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
}

export async function createAiMessage(
  aiConversationId: string,
  role: "USER" | "ASSISTANT",
  content: string,
  recommendedProducts?: Prisma.InputJsonValue
) {
  return prisma.aiMessage.create({
    data: {
      aiConversationId,
      role,
      content,
      recommendedProducts,
    },
  });
}
