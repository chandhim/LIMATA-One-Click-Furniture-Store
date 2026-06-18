"use client";
import { useRouter } from "next/navigation";
import { Loader2, MessageSquare, Plus } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/use-auth-store";
import { useConversations, useStartConversation } from "@/features/chat/hooks/use-chat";
import type { Conversation } from "@/features/chat/types/chat.types";
import { MainLayout } from "@/components/layout/main-layout";

function ConversationCard({
  conversation,
  isAdmin,
  onClick,
}: {
  conversation: Conversation;
  isAdmin: boolean;
  onClick: () => void;
}) {
  const lastMsg =
    conversation.messages && conversation.messages.length > 0
      ? conversation.messages[0]
      : null;

  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: "1rem 1.25rem",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        background: "var(--bg-surface)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        textAlign: "left",
        boxShadow: "var(--shadow-sm)",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translateY(-2px)";
        el.style.boxShadow = "var(--shadow-md)";
        el.style.borderColor = "var(--accent-light)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "var(--shadow-sm)";
        el.style.borderColor = "var(--border)";
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1rem",
          fontWeight: 700,
          color: "#fff",
          flexShrink: 0,
        }}
      >
        {isAdmin ? (conversation.customerId?.[0]?.toUpperCase() ?? "C") : "L"}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: 0,
            fontWeight: 600,
            fontSize: "0.9375rem",
            color: "var(--fg-primary)",
          }}
        >
          {isAdmin ? `Customer #${conversation.customerId.slice(-6)}` : "LIMATA Support"}
        </p>
        {lastMsg ? (
          <p
            style={{
              margin: "0.25rem 0 0",
              fontSize: "0.8125rem",
              color: "var(--fg-muted)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {lastMsg.content}
          </p>
        ) : (
          <p style={{ margin: "0.25rem 0 0", fontSize: "0.8125rem", color: "var(--fg-muted)", fontStyle: "italic" }}>
            No messages yet
          </p>
        )}
      </div>

      {/* Date */}
      <div style={{ flexShrink: 0, textAlign: "right" }}>
        <span style={{ fontSize: "0.75rem", color: "var(--fg-muted)" }}>
          {new Date(conversation.updatedAt).toLocaleDateString([], {
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
    </button>
  );
}

export default function MessagesPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { data: conversations = [], isLoading } = useConversations();
  const { start, isLoading: isStarting, error: startError } = useStartConversation();
  const isAdmin = user?.role === "ADMIN";

  const handleStartConversation = async () => {
    const conv = await start();
    if (conv) {
      router.push(`/messages/${conv.conversationId}`);
    }
  };

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div
          style={{
            minHeight: "70vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <p style={{ color: "var(--fg-muted)" }}>Please sign in to view your messages.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "2.5rem 1.5rem",
          minHeight: "80vh",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "2rem",
          }}
        >
          <div>
            <span className="section-label">Support</span>
            <h1
              style={{
                margin: "0.5rem 0 0",
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(1.5rem, 4vw, 2rem)",
                fontWeight: 700,
                color: "var(--fg-primary)",
              }}
            >
              {isAdmin ? "Customer Messages" : "My Messages"}
            </h1>
          </div>
          {!isAdmin && conversations.length === 0 && (
            <button
              onClick={handleStartConversation}
              disabled={isStarting}
              className="btn-shimmer"
              style={{
                padding: "0.625rem 1.25rem",
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
                <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
              ) : (
                <Plus size={16} />
              )}
              {isStarting ? "Starting…" : "New Conversation"}
            </button>
          )}
        </div>

        {/* Error */}
        {startError && (
          <div
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "var(--radius-md)",
              background: "rgba(231,76,60,0.08)",
              border: "1px solid rgba(231,76,60,0.25)",
              color: "#c0392b",
              fontSize: "0.875rem",
              marginBottom: "1rem",
            }}
          >
            {startError}
          </div>
        )}

        {/* Loading */}
        {isLoading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: "4rem",
              gap: "0.75rem",
              color: "var(--fg-muted)",
            }}
          >
            <Loader2 size={24} style={{ animation: "spin 1s linear infinite" }} />
            <span>Loading conversations…</span>
          </div>
        ) : conversations.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: "4rem",
              gap: "1.5rem",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "var(--accent-glow)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MessageSquare size={36} color="var(--accent)" />
            </div>
            <div>
              <p
                style={{
                  margin: "0 0 0.5rem",
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  color: "var(--fg-primary)",
                }}
              >
                {isAdmin ? "No customer conversations yet" : "No messages yet"}
              </p>
              <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--fg-muted)" }}>
                {isAdmin
                  ? "Customer conversations will appear here."
                  : "Start a conversation to get help from our team."}
              </p>
            </div>
            {!isAdmin && (
              <button
                onClick={handleStartConversation}
                disabled={isStarting}
                className="btn-shimmer"
                style={{
                  padding: "0.875rem 2rem",
                  borderRadius: "var(--radius-full)",
                  border: "none",
                  cursor: isStarting ? "not-allowed" : "pointer",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "var(--fg-primary)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                {isStarting ? (
                  <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                ) : (
                  <MessageSquare size={16} />
                )}
                Start a conversation
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {conversations.map((conv) => (
              <ConversationCard
                key={conv.conversationId}
                conversation={conv}
                isAdmin={isAdmin}
                onClick={() => router.push(`/messages/${conv.conversationId}`)}
              />
            ))}
          </div>
        )}
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </MainLayout>
  );
}
