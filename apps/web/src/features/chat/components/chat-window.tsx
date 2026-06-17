"use client";

import { Loader2 } from "lucide-react";
import {
  useConversation,
  useConversationMessages,
  useSendMessage,
} from "../hooks/use-chat";
import { MessageList } from "./message-list";
import { MessageInput } from "./message-input";

interface ChatWindowProps {
  conversationId: string;
  currentUserId: string;
}

export function ChatWindow({ conversationId, currentUserId }: ChatWindowProps) {
  const { data: conversation, isLoading } = useConversation(conversationId);
  const messages = useConversationMessages(conversationId);
  const { sendMessage, isSending } = useSendMessage();

  if (isLoading) {
    return (
      <div 
        style={{ 
          flex: 1, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          minHeight: "100%",
          color: "var(--fg-muted)"
        }}
      >
        <Loader2 className="animate-spin" size={28} style={{ color: "var(--accent)" }} />
      </div>
    );
  }

  if (!conversation) {
    return (
      <div 
        style={{ 
          flex: 1, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          color: "var(--fg-muted)",
          fontSize: "0.875rem"
        }}
      >
        <p>Conversation not found</p>
      </div>
    );
  }

  const handleSendMessage = (content: string) => {
    sendMessage(conversationId, content);
  };

  const customerCode = conversation.customerId.slice(-6).toUpperCase();

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Active Conversation Header */}
      <div 
        style={{ 
          borderBottom: "1px solid var(--border)", 
          padding: "1.25rem 1.5rem", 
          background: "var(--bg-surface)",
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem"
        }}
      >
        <h2 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--fg-primary)", margin: 0 }}>
          {conversation.customerId === currentUserId
            ? "Support Assistant"
            : `Active Session: Customer #${customerCode}`}
        </h2>
        <p style={{ fontSize: "0.75rem", color: "var(--fg-muted)", margin: 0 }}>
          Started {new Date(conversation.createdAt).toLocaleDateString([], { year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Messages Feed */}
      <MessageList messages={messages} currentUserId={currentUserId} />
      
      {/* Input Form Bar */}
      <MessageInput onSendMessage={handleSendMessage} isSending={isSending} />
    </div>
  );
}
