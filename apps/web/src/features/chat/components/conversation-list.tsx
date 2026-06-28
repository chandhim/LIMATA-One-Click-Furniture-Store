"use client";

import Link from "next/link";
import type { Conversation } from "../types/chat.types";

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId?: string;
  isAdmin?: boolean;
}

export function ConversationList({
  conversations,
  selectedConversationId,
  isAdmin = false,
}: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="p-4 text-center text-slate-400">
        <p>No conversations yet</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-200">
      {conversations.map((conversation) => {
        const lastMessage =
          conversation.messages && conversation.messages.length > 0
            ? conversation.messages[0]
            : null;

        return (
          <Link
            key={conversation.conversationId}
            href={
              isAdmin
                ? `/admin/messages/${conversation.conversationId}`
                : `/messages/${conversation.conversationId}`
            }
            className={`block p-4 hover:bg-slate-50 transition ${
              selectedConversationId === conversation.conversationId
                ? "bg-slate-100"
                : ""
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-medium text-slate-900">
                  {isAdmin
                    ? conversation.customer?.name ||
                      `Customer #${conversation.customerId.slice(-5).toUpperCase()}`
                    : "Seller"}
                </p>
                {lastMessage && (
                  <p className="text-sm text-slate-500 truncate mt-1">
                    {lastMessage.content}
                  </p>
                )}
              </div>
              <span className="text-xs text-slate-400 ml-2">
                {new Date(conversation.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
