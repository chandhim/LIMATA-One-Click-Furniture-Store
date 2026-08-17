import api from "@/lib/axios";
import type { Product } from "@/features/products/types/product.types";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  recommendedProducts?: Product[];
}

export interface AiChatRequest {
  message: string;
  history: ChatMessage[];
  context?: Record<string, any>;
}

export interface AiChatResponse {
  reply: string;
  recommendedProducts?: Product[];
}

export interface AiConversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface AiConversationDetail extends AiConversation {
  messages: ChatMessage[];
}

export async function getConversations(): Promise<AiConversation[]> {
  const response = await api.get<{ success: boolean; data: AiConversation[] }>("/ai/chat/conversations");
  return response.data.data;
}

export async function getConversationById(id: string): Promise<AiConversationDetail> {
  const response = await api.get<{ success: boolean; data: AiConversationDetail }>(`/ai/chat/conversations/${id}`);
  return response.data.data;
}

export async function sendAiChatMessage(
  data: AiChatRequest
): Promise<AiChatResponse & { conversationId?: string }> {
  try {
    const response = await api.post<{ success: boolean; data: AiChatResponse & { conversationId?: string } }>("/ai/chat", data);
    return response.data.data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to communicate with AI Assistant"
    );
  }
}
