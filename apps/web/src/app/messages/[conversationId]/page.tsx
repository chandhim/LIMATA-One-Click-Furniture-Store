"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, MessageCircle, Send } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/use-auth-store";
import {
  useConversation,
  useConversationMessages,
  useSendMessage,
} from "@/features/chat/hooks/use-chat";
import { MainLayout } from "@/components/layout/main-layout";

export default function ConversationPage() {
  const params = useParams<{ conversationId: string }>();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [content, setContent] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const conversationId = params.conversationId;
  const isAdmin = user?.role === "ADMIN";

  const { data: conversation, isLoading: convLoading } = useConversation(conversationId);
  const messages = useConversationMessages(conversationId);
  const { sendMessage, isSending } = useSendMessage();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      sendMessage(conversationId, content);
      setContent("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (content.trim()) {
        sendMessage(conversationId, content);
        setContent("");
      }
    }
  };

  const otherPartyName = isAdmin
    ? conversation
      ? `Customer #${conversation.customerId.slice(-6)}`
      : "Customer"
    : "LIMATA Support";

  return (
    <MainLayout>
      <div
        style={{
          maxWidth: 800,
          margin: "0 auto",
          padding: "1.5rem 1.5rem 0",
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 80px)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            paddingBottom: "1rem",
            borderBottom: "1px solid var(--border)",
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => router.push("/messages")}
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              borderRadius: "50%",
              width: 38,
              height: 38,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--fg-secondary)",
              flexShrink: 0,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "var(--fg-primary)";
              (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-light)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "var(--fg-secondary)";
              (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
            }}
            aria-label="Back to messages"
          >
            <ArrowLeft size={18} />
          </button>

          {/* Avatar */}
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1rem",
              fontWeight: 700,
              color: "#fff",
              flexShrink: 0,
              boxShadow: "var(--shadow-accent)",
            }}
          >
            {otherPartyName[0]?.toUpperCase()}
          </div>

          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "1rem",
                fontWeight: 700,
                color: "var(--fg-primary)",
                fontFamily: "var(--font-serif)",
              }}
            >
              {convLoading ? "Loading…" : otherPartyName}
            </h1>
            {conversation && (
              <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--fg-muted)" }}>
                Started {new Date(conversation.createdAt).toLocaleDateString([], {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
          </div>

          {/* Online indicator */}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.375rem" }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#10b981",
                boxShadow: "0 0 0 2px rgba(16,185,129,0.3)",
              }}
            />
            <span style={{ fontSize: "0.75rem", color: "var(--fg-muted)" }}>Online</span>
          </div>
        </div>

        {/* Messages area */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "1.5rem 0",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          {convLoading ? (
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.75rem",
                color: "var(--fg-muted)",
              }}
            >
              <Loader2 size={24} style={{ animation: "spin 1s linear infinite" }} />
              <span>Loading messages…</span>
            </div>
          ) : messages.length === 0 ? (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem",
                textAlign: "center",
                color: "var(--fg-muted)",
                paddingTop: "2rem",
              }}
            >
              <MessageCircle size={40} style={{ opacity: 0.2 }} />
              <div>
                <p style={{ margin: "0 0 0.25rem", fontSize: "1rem", fontWeight: 600, color: "var(--fg-secondary)" }}>
                  No messages yet
                </p>
                <p style={{ margin: 0, fontSize: "0.8125rem" }}>
                  Send the first message to start the conversation!
                </p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => {
                const isMine = msg.senderId === user?.userId;
                return (
                  <div
                    key={msg.messageId}
                    style={{
                      display: "flex",
                      justifyContent: isMine ? "flex-end" : "flex-start",
                    }}
                  >
                    {!isMine && (
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          color: "#fff",
                          flexShrink: 0,
                          marginRight: "0.5rem",
                          marginTop: "auto",
                        }}
                      >
                        {otherPartyName[0]?.toUpperCase()}
                      </div>
                    )}
                    <div
                      style={{
                        maxWidth: "65%",
                        padding: "0.625rem 1rem",
                        borderRadius: isMine
                          ? "18px 18px 4px 18px"
                          : "18px 18px 18px 4px",
                        background: isMine
                          ? "linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)"
                          : "var(--bg-surface)",
                        color: isMine ? "#fff" : "var(--fg-primary)",
                        border: isMine ? "none" : "1px solid var(--border)",
                        boxShadow: isMine ? "var(--shadow-accent)" : "var(--shadow-sm)",
                      }}
                    >
                      <p style={{ margin: 0, fontSize: "0.9rem", lineHeight: 1.55 }}>
                        {msg.content}
                      </p>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          opacity: 0.75,
                          display: "block",
                          marginTop: "0.3rem",
                          textAlign: isMine ? "right" : "left",
                        }}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    {isMine && (
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: "50%",
                          background: "var(--bg-elevated)",
                          border: "1px solid var(--border)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          color: "var(--fg-secondary)",
                          flexShrink: 0,
                          marginLeft: "0.5rem",
                          marginTop: "auto",
                        }}
                      >
                        {user?.name?.[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          style={{
            padding: "1rem 0 1.5rem",
            borderTop: "1px solid var(--border)",
            display: "flex",
            gap: "0.75rem",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message…"
            disabled={isSending || convLoading}
            style={{
              flex: 1,
              padding: "0.75rem 1.125rem",
              borderRadius: "var(--radius-full)",
              border: "1.5px solid var(--border)",
              background: "var(--bg-elevated)",
              fontSize: "0.9375rem",
              color: "var(--fg-primary)",
              outline: "none",
              fontFamily: "var(--font-sans)",
              transition: "border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.boxShadow = "0 0 0 3px var(--accent-glow)";
              e.currentTarget.style.background = "var(--bg-surface)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.background = "var(--bg-elevated)";
            }}
          />
          <button
            type="submit"
            disabled={isSending || !content.trim() || convLoading}
            className={content.trim() ? "btn-shimmer" : ""}
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              border: "none",
              cursor: content.trim() ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: content.trim() ? "var(--fg-primary)" : "#fff",
              background: content.trim()
                ? undefined
                : "var(--bg-elevated)",
              opacity: content.trim() ? 1 : 0.4,
              flexShrink: 0,
              transition: "opacity 0.2s ease",
            }}
            aria-label="Send message"
          >
            {isSending ? (
              <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} />
            ) : (
              <Send size={20} />
            )}
          </button>
        </form>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </MainLayout>
  );
}
