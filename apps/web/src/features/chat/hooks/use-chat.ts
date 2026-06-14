"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSocket } from "@/providers/socket-provider";
import { getConversations, getConversation, getMessages } from "../api/chat.api";
import type { Message } from "../types/chat.types";

export function useConversations() {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations,
  });
}

export function useConversation(conversationId: string) {
  return useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: () => getConversation(conversationId),
    enabled: !!conversationId,
  });
}

export function useConversationMessages(conversationId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const { socket } = useSocket();

  const { data: initialMessages } = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => getMessages(conversationId),
    enabled: !!conversationId,
  });

  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  useEffect(() => {
    if (!socket || !conversationId) return;

    socket.emit("join_conversation", { conversationId });

    socket.on("message_received", (message: Message) => {
      if (message.conversationId === conversationId) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.emit("leave_conversation", { conversationId });
      socket.off("message_received");
    };
  }, [socket, conversationId]);

  return messages;
}

export function useSendMessage() {
  const { socket } = useSocket();
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  type AckResponse = { error?: string; success?: boolean };

  const sendMessage = (conversationId: string, content: string) => {
    if (!socket) {
      setError("Socket not connected");
      return;
    }

    if (!content.trim()) {
      setError("Message cannot be empty");
      return;
    }

    setIsSending(true);
    setError(null);

    socket.emit(
      "send_message",
      { conversationId, content },
      (response: AckResponse) => {
        setIsSending(false);
        if (response?.error) {
          setError(response.error);
        }
      },
    );
  };

  return { sendMessage, isSending, error };
}
