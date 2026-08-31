import { useState, useCallback } from "react";
import { 
  sendAiChatMessage, 
  getConversations, 
  getConversationById, 
  type ChatMessage, 
  type AiConversation 
} from "../api/ai-chat.api";
import { useAuthStore } from "@/features/auth/store/use-auth-store";
import type { AppError } from "@/lib/axios";

export function useAiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);

  const [conversations, setConversations] = useState<AiConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const loadConversations = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setIsHistoryLoading(true);
      const data = await getConversations();
      setConversations(data);
    } catch (err) {
      console.error("Failed to load conversations:", err);
    } finally {
      setIsHistoryLoading(false);
    }
  }, [isAuthenticated]);

  const loadConversation = useCallback(async (id: string) => {
    if (!isAuthenticated) return;
    try {
      setIsHistoryLoading(true);
      const data = await getConversationById(id);
      setActiveConversationId(id);
      setMessages(data.messages);
      setError(null);
    } catch (err) {
      const error = err as Record<string, unknown>;
      setError(error?.isAppError ? (error as unknown as AppError) : { isAppError: true, status: null, type: 'unknown', message: "Failed to load conversation history." });
      console.error("Failed to load conversation:", err);
    } finally {
      setIsHistoryLoading(false);
    }
  }, [isAuthenticated]);

  const startNewConversation = useCallback(() => {
    setActiveConversationId(null);
    setMessages([]);
    setError(null);
  }, []);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = { role: "user", content };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendAiChatMessage({
        message: content,
        history: messages,
        context: activeConversationId ? { conversationId: activeConversationId } : undefined
      });

      if (response.conversationId && !activeConversationId) {
        setActiveConversationId(response.conversationId);
      }

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response.reply,
        recommendedProducts: response.recommendedProducts
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const error = err as Record<string, unknown>;
      setError(error?.isAppError ? (error as unknown as AppError) : { isAppError: true, status: null, type: 'server', message: "Something went wrong. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    setMessages,
    conversations,
    activeConversationId,
    isHistoryLoading,
    loadConversations,
    loadConversation,
    startNewConversation
  };
}
