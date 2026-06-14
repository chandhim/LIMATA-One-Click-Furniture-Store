import api from "@/lib/axios";
import type {
  Conversation,
  GetConversationsResponse,
  GetConversationResponse,
  GetMessagesResponse,
  StartConversationResponse,
  Message,
} from "../types/chat.types";

export async function getConversations(): Promise<Conversation[]> {
  try {
    const response = await api.get<{
      success: boolean;
      data: GetConversationsResponse;
    }>("/chat/conversations");
    return response.data.data.conversations;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to get conversations");
  }
}

export async function startConversation(): Promise<Conversation> {
  try {
    const response = await api.post<{
      success: boolean;
      data: StartConversationResponse;
    }>("/chat/conversations/start");
    return response.data.data.conversation;
  } catch (error) {
    if (error instanceof Error && error.message.includes("409")) {
      throw new Error("You already have an active conversation");
    }
    throw new Error(error instanceof Error ? error.message : "Failed to start conversation");
  }
}

export async function getConversation(conversationId: string): Promise<Conversation> {
  try {
    const response = await api.get<{
      success: boolean;
      data: GetConversationResponse;
    }>(`/chat/conversations/${conversationId}`);
    return response.data.data.conversation;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to get conversation");
  }
}

export async function getMessages(
  conversationId: string,
  skip?: number,
  take?: number,
): Promise<Message[]> {
  try {
    const params = new URLSearchParams();
    if (skip !== undefined) params.append("skip", skip.toString());
    if (take !== undefined) params.append("take", take.toString());

    const response = await api.get<{
      success: boolean;
      data: GetMessagesResponse;
    }>(`/chat/conversations/${conversationId}/messages?${params}`);

    return response.data.data.messages;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to get messages");
  }
}
