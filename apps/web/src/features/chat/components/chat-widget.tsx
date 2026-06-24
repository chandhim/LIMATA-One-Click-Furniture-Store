"use client";

import { useEffect, useRef, useState } from "react";
import {
  MessageSquare,
  X,
  ChevronLeft,
  Loader2,
  Send,
  MessageCircle,
} from "lucide-react";
import {
  useConversations,
  useConversationMessages,
  useSendMessage,
  useStartConversation,
} from "../hooks/use-chat";
import type { Conversation } from "../types/chat.types";
import { useAuthStore } from "@/features/auth/store/use-auth-store";

// ── Message List ────────────────────────────────────────────────────────────

import { ProductPreviewCard } from "./product-preview-card";

function MessageBubble({
  content,
  createdAt,
  isMine,
}: {
  content: string;
  createdAt: Date;
  isMine: boolean;
}) {
  const productMatch = content.match(
    /I am interested in this product:?\s*([\s\S]*?)\s*\((.*?\/products\/([^)\s]+))\)/i,
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isMine ? "flex-end" : "flex-start",
        marginBottom: "0.5rem",
      }}
    >
      <div
        style={{
          maxWidth: "75%",
          padding: "0.5rem 0.875rem",
          borderRadius: isMine ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          background: isMine
            ? "linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)"
            : "var(--bg-elevated)",
          color: isMine ? "#fff" : "var(--fg-primary)",
          border: isMine ? "none" : "1px solid var(--border)",
          boxShadow: isMine ? "var(--shadow-accent)" : "var(--shadow-sm)",
        }}
      >
        {productMatch ? (
          <>
            <p
              style={{
                fontSize: "0.875rem",
                lineHeight: 1.5,
                margin: "0 0 0.5rem 0",
              }}
            >
              I am interested in this product:
            </p>
            <ProductPreviewCard productId={productMatch[3]} isMine={isMine} />
          </>
        ) : (
          <p style={{ fontSize: "0.875rem", lineHeight: 1.5, margin: 0 }}>
            {content}
          </p>
        )}
        <span
          style={{
            fontSize: "0.7rem",
            opacity: 0.7,
            display: "block",
            marginTop: "0.2rem",
            textAlign: isMine ? "right" : "left",
          }}
        >
          {new Date(createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}

// ── Chat Thread View ────────────────────────────────────────────────────────

function ChatThread({
  conversationId,
  currentUserId,
  onBack,
  title,
}: {
  conversationId: string;
  currentUserId: string;
  onBack?: () => void;
  title: string;
}) {
  const messages = useConversationMessages(conversationId);
  const { sendMessage, isSending } = useSendMessage();
  const [content, setContent] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

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

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Thread header */}
      <div
        style={{
          padding: "0.75rem 1rem",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "var(--bg-surface)",
          flexShrink: 0,
        }}
      >
        {onBack && (
          <button
            onClick={onBack}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--fg-secondary)",
              display: "flex",
              alignItems: "center",
              padding: "0.25rem",
              borderRadius: "var(--radius-sm)",
            }}
            aria-label="Back to conversations"
          >
            <ChevronLeft size={18} />
          </button>
        )}
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.75rem",
            fontWeight: 700,
            color: "#fff",
            flexShrink: 0,
          }}
        >
          {title[0]?.toUpperCase()}
        </div>
        <div>
          <p
            style={{
              margin: 0,
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "var(--fg-primary)",
            }}
          >
            {title}
          </p>
          <p
            style={{ margin: 0, fontSize: "0.7rem", color: "var(--fg-muted)" }}
          >
            Online
          </p>
        </div>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
          background: "var(--bg-base)",
        }}
      >
        {messages.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              gap: "0.75rem",
              color: "var(--fg-muted)",
            }}
          >
            <MessageCircle size={36} style={{ opacity: 0.3 }} />
            <p style={{ margin: 0, fontSize: "0.875rem" }}>
              No messages yet. Say hello!
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.messageId}
              content={msg.content}
              createdAt={msg.createdAt}
              isMine={msg.senderId === currentUserId}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        style={{
          padding: "0.75rem",
          borderTop: "1px solid var(--border)",
          background: "var(--bg-surface)",
          display: "flex",
          gap: "0.5rem",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message…"
          disabled={isSending}
          style={{
            flex: 1,
            padding: "0.625rem 0.875rem",
            borderRadius: "var(--radius-full)",
            border: "1.5px solid var(--border)",
            background: "var(--bg-elevated)",
            fontSize: "0.875rem",
            color: "var(--fg-primary)",
            outline: "none",
            fontFamily: "var(--font-sans)",
            transition: "border-color 0.2s ease, box-shadow 0.2s ease",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--accent)";
            e.currentTarget.style.boxShadow = "0 0 0 3px var(--accent-glow)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
        <button
          type="submit"
          disabled={isSending || !content.trim()}
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)",
            border: "none",
            cursor: content.trim() ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            opacity: content.trim() ? 1 : 0.5,
            transition: "opacity 0.2s ease, transform 0.2s ease",
            flexShrink: 0,
            boxShadow: content.trim() ? "var(--shadow-accent)" : "none",
          }}
          aria-label="Send message"
        >
          {isSending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
        </button>
      </form>
    </div>
  );
}

// ── Conversation List ────────────────────────────────────────────────────────

function ConversationListView({
  conversations,
  onSelect,
  isAdmin,
}: {
  conversations: Conversation[];
  onSelect: (conv: Conversation) => void;
  isAdmin: boolean;
}) {
  if (conversations.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          color: "var(--fg-muted)",
          gap: "0.75rem",
          padding: "2rem",
        }}
      >
        <MessageSquare size={36} style={{ opacity: 0.3 }} />
        <p style={{ margin: 0, fontSize: "0.875rem", textAlign: "center" }}>
          {isAdmin ? "No customer conversations yet." : "No conversations yet."}
        </p>
      </div>
    );
  }

  return (
    <div style={{ overflowY: "auto", flex: 1 }}>
      {conversations.map((conv) => {
        const lastMsg =
          conv.messages && conv.messages.length > 0 ? conv.messages[0] : null;
        return (
          <button
            key={conv.conversationId}
            onClick={() => onSelect(conv)}
            style={{
              width: "100%",
              padding: "0.875rem 1rem",
              border: "none",
              borderBottom: "1px solid var(--border)",
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              textAlign: "left",
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "var(--bg-elevated)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.875rem",
                fontWeight: 700,
                color: "#fff",
                flexShrink: 0,
              }}
            >
              {isAdmin ? (conv.customerId?.[0]?.toUpperCase() ?? "C") : "S"}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "var(--fg-primary)",
                }}
              >
                {isAdmin
                  ? `Customer #${conv.customerId.slice(-4)}`
                  : "LIMATA Support"}
              </p>
              {lastMsg && (
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.75rem",
                    color: "var(--fg-muted)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    marginTop: "0.125rem",
                  }}
                >
                  {lastMsg.content}
                </p>
              )}
            </div>
            <span
              style={{
                fontSize: "0.7rem",
                color: "var(--fg-muted)",
                flexShrink: 0,
              }}
            >
              {new Date(conv.updatedAt).toLocaleDateString([], {
                month: "short",
                day: "numeric",
              })}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ── Main Chat Widget ─────────────────────────────────────────────────────────

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { data: conversations = [], isLoading } = useConversations();
  const {
    start,
    isLoading: isStarting,
    error: startError,
  } = useStartConversation();
  const { sendMessage } = useSendMessage();
  const [pendingProductMsg, setPendingProductMsg] = useState<string | null>(
    null,
  );

  const isAdmin = user?.role === "ADMIN";

  const handleStartChat = async () => {
    const conv = await start();
    if (conv) {
      setSelectedConversation(conv);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (!isAdmin && conversations.length === 0 && !isLoading) {
      handleStartChat();
    }
  };
  useEffect(() => {
    if (
      !isAdmin &&
      conversations.length === 1 &&
      !selectedConversation &&
      isOpen
    ) {
      setSelectedConversation(conversations[0]);
    }
  }, [conversations, isAdmin, selectedConversation, isOpen]);

  useEffect(() => {
    const handleOpenChat = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsOpen(true);

      const { productId, productName, origin } = customEvent.detail || {};

      if (productId) {
        const msg = `I am interested in this product: ${productName} (${origin}/products/${productId})`;
        setPendingProductMsg(msg);

        // If customer has no conversation, start one
        if (!isAdmin && conversations.length === 0 && !isLoading) {
          handleStartChat();
        } else if (!isAdmin && conversations.length === 1) {
          setSelectedConversation(conversations[0]);
        }
      }
    };

    window.addEventListener("open-chat", handleOpenChat);
    return () => window.removeEventListener("open-chat", handleOpenChat);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversations, isAdmin, isLoading]);

  // Process pending message when a conversation is selected
  useEffect(() => {
    if (pendingProductMsg && selectedConversation) {
      sendMessage(selectedConversation.conversationId, pendingProductMsg);
      setPendingProductMsg(null);
    }
  }, [pendingProductMsg, selectedConversation, sendMessage]);

  if (!isAuthenticated || !user) return null;

  const showList = isAdmin || conversations.length > 1;

  return (
    <>
      {/* Floating Chat Button */}
      <button
        id="chat-widget-trigger"
        onClick={isOpen ? () => setIsOpen(false) : handleOpen}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          width: 54,
          height: 54,
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          boxShadow: "var(--shadow-accent), var(--shadow-lg)",
          zIndex: 1000,
          transition:
            "transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "scale(1.08)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "scale(1)";
        }}
      >
        {isOpen ? <X size={22} /> : <MessageSquare size={22} />}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div
          id="chat-widget-panel"
          className="animate-scale-in"
          style={{
            position: "fixed",
            bottom: "5.5rem",
            right: "1.5rem",
            width: 360,
            height: 520,
            background: "var(--bg-surface)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-lg)",
            border: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 999,
          }}
        >
          {/* Panel Header */}
          <div
            style={{
              padding: "1rem 1.125rem",
              background:
                "linear-gradient(135deg, var(--fg-primary) 0%, var(--bg-dark-2) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                L
              </div>
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    color: "#FAF9F7",
                    fontFamily: "var(--font-serif)",
                  }}
                >
                  LIMATA Chat
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.7rem",
                    color: "var(--accent-light)",
                  }}
                >
                  {isAdmin ? "Admin view" : "We reply within minutes"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "none",
                borderRadius: "var(--radius-sm)",
                width: 28,
                height: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#FAF9F7",
              }}
              aria-label="Close chat"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {isLoading ? (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--fg-muted)",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <Loader2
                  size={28}
                  style={{ animation: "spin 1s linear infinite" }}
                />
                <p style={{ margin: 0, fontSize: "0.875rem" }}>
                  Loading conversations…
                </p>
              </div>
            ) : selectedConversation ? (
              // Show the conversation thread
              <ChatThread
                conversationId={selectedConversation.conversationId}
                currentUserId={user.userId}
                title={
                  isAdmin
                    ? `Customer #${selectedConversation.customerId.slice(-4)}`
                    : "LIMATA Support"
                }
                onBack={
                  showList ? () => setSelectedConversation(null) : undefined
                }
              />
            ) : showList ? (
              // Admin: show conversation list
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    padding: "0.75rem 1rem",
                    borderBottom: "1px solid var(--border)",
                    background: "var(--bg-elevated)",
                    flexShrink: 0,
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color: "var(--fg-secondary)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {conversations.length} conversation
                    {conversations.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <ConversationListView
                  conversations={conversations}
                  onSelect={setSelectedConversation}
                  isAdmin={isAdmin}
                />
              </div>
            ) : (
              // Customer with no conversation
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "2rem",
                  gap: "1rem",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: "var(--accent-glow)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MessageSquare size={28} color="var(--accent)" />
                </div>
                <div>
                  <p
                    style={{
                      margin: "0 0 0.375rem",
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: "var(--fg-primary)",
                      fontFamily: "var(--font-serif)",
                    }}
                  >
                    How can we help?
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.8rem",
                      color: "var(--fg-muted)",
                    }}
                  >
                    Chat with our support team about your orders, products, or
                    anything else.
                  </p>
                </div>
                {startError && (
                  <p
                    style={{ margin: 0, fontSize: "0.8rem", color: "#e74c3c" }}
                  >
                    {startError}
                  </p>
                )}
                <button
                  onClick={handleStartChat}
                  disabled={isStarting}
                  className="btn-shimmer"
                  style={{
                    padding: "0.75rem 1.5rem",
                    borderRadius: "var(--radius-full)",
                    border: "none",
                    cursor: isStarting ? "not-allowed" : "pointer",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "var(--fg-primary)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    opacity: isStarting ? 0.7 : 1,
                  }}
                >
                  {isStarting ? (
                    <>
                      <Loader2
                        size={16}
                        style={{ animation: "spin 1s linear infinite" }}
                      />{" "}
                      Starting…
                    </>
                  ) : (
                    <>
                      <MessageSquare size={16} /> Start a conversation
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 480px) {
          #chat-widget-panel {
            width: calc(100vw - 2rem) !important;
            right: 1rem !important;
            bottom: 5rem !important;
          }
        }
      `}</style>
    </>
  );
}
