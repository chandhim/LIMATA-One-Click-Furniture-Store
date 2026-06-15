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
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="animate-spin text-slate-400" size={32} />
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400">
        <p>Conversation not found</p>
      </div>
    );
  }

  const handleSendMessage = (content: string) => {
    sendMessage(conversationId, content);
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b border-slate-200 p-4 bg-white">
        <h2 className="font-semibold text-slate-900">
          {conversation.customerId === currentUserId
            ? "Seller"
            : `Customer: ${conversation.customerId}`}
        </h2>
        <p className="text-sm text-slate-500">
          Started {new Date(conversation.createdAt).toLocaleDateString()}
        </p>
      </div>

      <MessageList messages={messages} currentUserId={currentUserId} />
      <MessageInput onSendMessage={handleSendMessage} isSending={isSending} />
    </div>
  );
}
