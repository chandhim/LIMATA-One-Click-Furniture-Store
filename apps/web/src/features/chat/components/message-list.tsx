"use client";

import { useEffect, useRef } from "react";
import type { Message } from "../types/chat.types";

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div 
      style={{ 
        flex: 1, 
        overflowY: "auto", 
        background: "var(--bg-elevated)", 
        padding: "1.5rem", 
        display: "flex", 
        flexDirection: "column", 
        gap: "1rem" 
      }}
    >
      {messages.length === 0 ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--fg-muted)" }}>
          <p style={{ fontSize: "0.85rem", margin: 0 }}>
            No messages yet. Send a response to initiate the conversation!
          </p>
        </div>
      ) : (
        <>
          {messages.map((message) => {
            const isMe = message.senderId === currentUserId;
            return (
              <div
                key={message.messageId}
                style={{
                  display: "flex",
                  justifyContent: isMe ? "flex-end" : "flex-start",
                  width: "100%"
                }}
              >
                <div
                  style={{
                    maxWidth: "70%",
                    padding: "0.75rem 1rem",
                    borderRadius: isMe 
                      ? "var(--radius-lg) var(--radius-lg) 0 var(--radius-lg)" 
                      : "var(--radius-lg) var(--radius-lg) var(--radius-lg) 0",
                    background: isMe ? "var(--bg-dark)" : "var(--bg-surface)",
                    color: isMe ? "#FAF9F7" : "var(--fg-primary)",
                    border: isMe ? "1px solid rgba(250,249,247,0.08)" : "1px solid var(--border)",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                  }}
                >
                  <p style={{ margin: 0, fontSize: "0.85rem", lineHeight: 1.4, wordBreak: "break-word" }}>
                    {message.content}
                  </p>
                  <span 
                    style={{ 
                      fontSize: "0.68rem", 
                      opacity: 0.6, 
                      marginTop: "0.375rem", 
                      display: "block",
                      textAlign: "right",
                      fontStyle: "italic"
                    }}
                  >
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={endRef} />
        </>
      )}
    </div>
  );
}
