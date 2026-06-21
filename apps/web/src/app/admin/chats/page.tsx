"use client";

import { useState } from "react";
import { useConversations } from "@/features/chat/hooks/use-chat";
import { ChatWindow } from "@/features/chat/components/chat-window";
import { useAuthStore } from "@/features/auth/store/use-auth-store";
import type { Conversation } from "@/features/chat/types/chat.types";
import { MessageSquare, Inbox, Search, ChevronLeft } from "lucide-react";

export default function AdminChatsPage() {
  const user = useAuthStore((s) => s.user);
  const { data, isLoading } = useConversations();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const conversations = data ?? [];

  // Filter conversations if search is active (by customer ID, name, or email)
  const filteredConversations = conversations.filter((c: Conversation) => {
    const query = searchQuery.toLowerCase();
    const matchesId = c.customerId.toLowerCase().includes(query);
    const matchesName = c.customer?.name?.toLowerCase().includes(query) ?? false;
    const matchesEmail = c.customer?.email?.toLowerCase().includes(query) ?? false;
    return matchesId || matchesName || matchesEmail;
  });

  if (isLoading) {
    return (
      <div 
        style={{ 
          padding: "4rem", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          minHeight: "80vh", 
          color: "var(--fg-muted)", 
          gap: "0.75rem",
          background: "var(--bg-base)"
        }}
      >
        <div style={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid var(--accent)", borderTopColor: "transparent", animation: "spin 0.7s linear infinite" }} />
        <span>Loading conversations...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "calc(100vh - 64px)", minHeight: 500, background: "var(--bg-base)", overflow: "hidden" }}>
      
      {/* Sidebar - Support Inbox */}
      <div
        className="admin-chat-sidebar"
        style={{
          borderRight: "1px solid var(--border)",
          background: "var(--bg-surface)",
          flexDirection: "column",
          flexShrink: 0,
          height: "100%",
        }}
      >
        {/* Sidebar Header */}
        <div style={{ padding: "1.5rem 1.5rem 1.25rem", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.375rem" }}>
            <MessageSquare size={18} style={{ color: "var(--accent)" }} />
            <h3 style={{ margin: 0, fontSize: "1.0625rem", fontWeight: 700, color: "var(--fg-primary)" }}>Support Inbox</h3>
          </div>
          <p style={{ margin: "0 0 1rem", fontSize: "0.75rem", color: "var(--fg-muted)" }}>
            Respond to active customer questions and AR queries.
          </p>

          {/* Search bar inside inbox */}
          <div style={{ position: "relative", width: "100%" }}>
            <Search 
              size={14} 
              style={{ 
                position: "absolute", 
                left: "0.75rem", 
                top: "50%", 
                transform: "translateY(-50%)", 
                color: "var(--fg-muted)" 
              }} 
            />
            <input
              type="text"
              placeholder="Search by customer name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-base"
              style={{ 
                padding: "0.5rem 0.75rem 0.5rem 2.25rem", 
                fontSize: "0.78rem",
                borderRadius: "var(--radius-md)"
              }}
            />
          </div>
        </div>

        {/* Conversations list feed */}
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
          {filteredConversations.length === 0 ? (
            <div style={{ padding: "3.5rem 2rem", textAlign: "center", color: "var(--fg-muted)", fontSize: "0.825rem" }}>
              <Inbox size={28} style={{ opacity: 0.25, marginBottom: "0.75rem", color: "var(--fg-primary)" }} />
              <p style={{ margin: 0, fontWeight: 500 }}>No conversations found</p>
            </div>
          ) : (
            filteredConversations.map((conv: Conversation) => {
              const lastMsg = conv.messages?.[0];
              const isSelected = selectedConversationId === conv.conversationId;
              const formattedDate = lastMsg
                ? new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : new Date(conv.createdAt).toLocaleDateString([], { month: "short", day: "numeric" });
              
              const initials = conv.customer?.name
                ? (() => {
                    const parts = conv.customer.name.trim().split(/\s+/);
                    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
                    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
                  })()
                : conv.customerId.slice(-4).toUpperCase();

              return (
                <div
                  key={conv.conversationId}
                  onClick={() => setSelectedConversationId(conv.conversationId)}
                  style={{
                    padding: "1.125rem 1.5rem",
                    borderBottom: "1px solid var(--border)",
                    cursor: "pointer",
                    background: isSelected ? "var(--bg-elevated)" : "transparent",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.875rem",
                    borderLeft: isSelected ? "3px solid var(--accent)" : "3px solid transparent"
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.background = "var(--bg-elevated)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.background = "transparent";
                  }}
                >
                  {/* Monogram Customer Avatar Bubble */}
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: isSelected 
                        ? "linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)" 
                        : "var(--bg-elevated)",
                      border: "1px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      color: isSelected ? "#1C1A17" : "var(--fg-secondary)",
                      flexShrink: 0,
                      boxShadow: isSelected ? "0 2px 6px rgba(201,169,110,0.15)" : "none",
                      transition: "all 0.2s ease"
                    }}
                  >
                    {conv.customer?.name ? initials : initials.slice(0, 2)}
                  </div>

                  <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.825rem", fontWeight: 700, color: "var(--fg-primary)" }}>
                        {conv.customer?.name || `Customer #${initials}`}
                      </span>
                      <span style={{ fontSize: "0.7rem", color: "var(--fg-muted)" }}>{formattedDate}</span>
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.78rem",
                        color: isSelected ? "var(--fg-primary)" : "var(--fg-secondary)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        lineHeight: 1.4
                      }}
                    >
                      {lastMsg ? lastMsg.content : "No messages yet"}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main chat window container */}
      <div className="admin-chat-main" style={{ flexDirection: "column", background: "var(--bg-elevated)", height: "100%", overflow: "hidden" }}>
        {selectedConversationId && user?.userId ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--bg-surface)", height: "100%", overflow: "hidden" }}>
            {/* Mobile Back Button */}
            <div className="mobile-chat-back" style={{ display: "none", padding: "0.75rem 1rem", borderBottom: "1px solid var(--border)", background: "var(--bg-elevated)", alignItems: "center" }}>
              <button onClick={() => setSelectedConversationId(null)} style={{ background: "transparent", border: "none", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--fg-primary)", fontWeight: 600, cursor: "pointer", padding: "0.25rem 0.5rem", borderRadius: "var(--radius-sm)" }}>
                <ChevronLeft size={16} />
                Back to Inbox
              </button>
            </div>
            <ChatWindow conversationId={selectedConversationId} currentUserId={user.userId} />
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--fg-muted)" }}>
            <div 
              style={{ 
                width: 64, 
                height: 64, 
                borderRadius: "50%", 
                background: "var(--bg-surface)", 
                border: "1px solid var(--border)",
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                fontSize: "1.75rem",
                color: "var(--accent)",
                boxShadow: "var(--shadow-sm)",
                marginBottom: "1.25rem"
              }}
            >
              💬
            </div>
            <h4 className="font-serif" style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--fg-primary)", margin: "0 0 0.375rem" }}>
              Select a conversation
            </h4>
            <p style={{ fontSize: "0.8rem", color: "var(--fg-muted)", margin: 0 }}>
              Select a customer conversation from the list to start messaging in real-time.
            </p>
          </div>
        )}
      </div>

      <style>{`
        .admin-chat-sidebar {
          width: 340px;
          display: flex;
        }
        .admin-chat-main {
          flex: 1;
          display: flex;
        }
        @media (max-width: 768px) {
          .admin-chat-sidebar {
            width: 100%;
            display: ${selectedConversationId ? 'none' : 'flex'};
          }
          .admin-chat-main {
            display: ${selectedConversationId ? 'flex' : 'none'};
            width: 100%;
          }
          .mobile-chat-back {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}
