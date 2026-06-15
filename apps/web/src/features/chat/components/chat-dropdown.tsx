"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MessageSquare,
  MoreHorizontal,
  Maximize2,
  SquarePen,
  Search,
  MessageCircle,
  Loader2,
  X,
} from "lucide-react";
import { useConversations, useStartConversation } from "../hooks/use-chat";
import { useAuthStore } from "@/features/auth/store/use-auth-store";
import type { Conversation } from "../types/chat.types";

// Helper to format relative time like '1w', '3d', '12h', 'now'
function formatRelativeTime(dateInput: Date | string | undefined): string {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);

  if (diffSecs < 30) return "now";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return `${diffWeeks}w`;
}

// Generate premium HSL colors for avatars based on string hash
function getAvatarColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash % 360);
  return {
    bg: `hsl(${h}, 70%, 93%)`,
    text: `hsl(${h}, 70%, 35%)`,
    border: `hsl(${h}, 70%, 80%)`,
  };
}

export function ChatDropdown() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "groups" | "communities">("all");
  const [showRestoreBanner, setShowRestoreBanner] = useState(true);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { data: conversations = [], isLoading } = useConversations();
  const { start, isLoading: isStarting } = useStartConversation();

  const isAdmin = user?.role === "ADMIN";

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!isAuthenticated || !user) return null;

  // Handle new message click
  const handleNewMessage = async () => {
    if (isAdmin) {
      // Admins go to main messages page to select a user
      setIsOpen(false);
      router.push("/messages");
    } else {
      // Customers auto-start or open their conversation
      const conv = await start();
      if (conv) {
        setIsOpen(false);
        router.push(`/messages/${conv.id}`);
      }
    }
  };

  // Filter conversations based on tab and search query
  const filteredConversations = conversations.filter((conv) => {
    const otherPartyName = isAdmin
      ? `Customer #${conv.customerId.slice(-6)}`
      : "LIMATA Support";

    const lastMsg = conv.messages && conv.messages.length > 0 ? conv.messages[0] : null;
    const matchesSearch =
      otherPartyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lastMsg && lastMsg.content.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeTab === "unread") {
      // Simulating unread: if the last message is not from current user, mark it as unread for the dropdown view
      return lastMsg && lastMsg.senderId !== user.id;
    }
    
    if (activeTab === "groups" || activeTab === "communities") {
      // Simulated tabs, return nothing for groups/communities
      return false;
    }

    return true;
  });

  // Count unread conversations
  const unreadCount = conversations.filter((conv) => {
    const lastMsg = conv.messages && conv.messages.length > 0 ? conv.messages[0] : null;
    return lastMsg && lastMsg.senderId !== user.id;
  }).length;

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      {/* Messages Icon Button */}
      <button
        id="navbar-chat-dropdown-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Chats"
        style={{
          position: "relative",
          width: 38,
          height: 38,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: isOpen ? "var(--bg-elevated)" : "transparent",
          border: `1.5px solid ${isOpen ? "var(--border)" : "transparent"}`,
          cursor: "pointer",
          color: isOpen ? "var(--fg-primary)" : "var(--fg-secondary)",
          transition: "all 0.2s ease",
          padding: 0,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = "var(--bg-elevated)";
          (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
          (e.currentTarget as HTMLElement).style.color = "var(--fg-primary)";
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.borderColor = "transparent";
            (e.currentTarget as HTMLElement).style.color = "var(--fg-secondary)";
          }
        }}
      >
        <MessageSquare size={18} />
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: -2,
              right: -2,
              minWidth: 18,
              height: 18,
              borderRadius: "50%",
              background: "var(--accent, #C9A96E)",
              color: "#fff",
              fontSize: "0.65rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 4px",
              border: "2px solid var(--bg-base)",
              boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          id="chat-dropdown-panel"
          className="animate-slide-down"
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: -60,
            width: 360,
            maxHeight: 520,
            background: "var(--bg-surface)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-lg)",
            border: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 200,
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "1rem 1rem 0.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: "1.375rem",
                fontWeight: 800,
                color: "var(--fg-primary)",
                fontFamily: "var(--font-sans)",
                letterSpacing: "-0.01em",
              }}
            >
              Chats
            </h3>
            
            <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
              {/* Options Icon */}
              <button
                title="Options"
                style={{
                  background: "var(--bg-elevated)",
                  border: "none",
                  borderRadius: "50%",
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--fg-primary)",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--border)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--bg-elevated)")}
              >
                <MoreHorizontal size={16} />
              </button>

              {/* Expand Icon */}
              <Link
                href="/messages"
                onClick={() => setIsOpen(false)}
                title="See all in Messenger"
                style={{
                  background: "var(--bg-elevated)",
                  borderRadius: "50%",
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--fg-primary)",
                  cursor: "pointer",
                  textDecoration: "none",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--border)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--bg-elevated)")}
              >
                <Maximize2 size={14} />
              </Link>

              {/* New Message Icon */}
              <button
                onClick={handleNewMessage}
                disabled={isStarting}
                title="New message"
                style={{
                  background: "var(--bg-elevated)",
                  border: "none",
                  borderRadius: "50%",
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--fg-primary)",
                  cursor: isStarting ? "not-allowed" : "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--border)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--bg-elevated)")}
              >
                {isStarting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <SquarePen size={14} />
                )}
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div style={{ padding: "0.25rem 1rem 0.5rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "var(--bg-elevated)",
                borderRadius: "var(--radius-full)",
                padding: "0.45rem 0.875rem",
                border: "1px solid transparent",
                transition: "all 0.2s ease",
              }}
            >
              <Search size={14} style={{ color: "var(--fg-muted)", flexShrink: 0 }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Messenger"
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: "0.875rem",
                  color: "var(--fg-primary)",
                  width: "100%",
                  padding: 0,
                  fontFamily: "var(--font-sans)",
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    color: "var(--fg-muted)",
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div
            style={{
              display: "flex",
              gap: "0.375rem",
              padding: "0.25rem 1rem 0.5rem",
              overflowX: "auto",
              scrollbarWidth: "none",
            }}
          >
            {[
              { id: "all", label: "All" },
              { id: "unread", label: "Unread" },
              { id: "groups", label: "Groups" },
              { id: "communities", label: "Communities" },
            ].map((tabInfo) => {
              const isSelected = activeTab === tabInfo.id;
              // Specific Messenger colors: light blue background for selected tab
              const tabBg = isSelected ? "rgba(201, 169, 110, 0.15)" : "transparent";
              const tabColor = isSelected ? "var(--accent-dark)" : "var(--fg-secondary)";
              const tabFontWeight = isSelected ? 600 : 500;

              return (
                <button
                  key={tabInfo.id}
                  onClick={() => setActiveTab(tabInfo.id as any)}
                  style={{
                    padding: "0.375rem 0.875rem",
                    borderRadius: "var(--radius-full)",
                    border: "none",
                    background: tabBg,
                    color: tabColor,
                    fontSize: "0.8125rem",
                    fontWeight: tabFontWeight,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = "var(--bg-elevated)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  {tabInfo.label}
                </button>
              );
            })}
          </div>

          {/* Alert banner: Missing chat history. Restore now */}
          {showRestoreBanner && (
            <div
              style={{
                margin: "0.25rem 1rem 0.5rem",
                padding: "0.5rem 0.75rem",
                borderRadius: "var(--radius-md)",
                background: "rgba(201, 169, 110, 0.08)",
                border: "1.5px solid rgba(201, 169, 110, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.5rem",
              }}
            >
              <div style={{ fontSize: "0.75rem", color: "var(--fg-secondary)", lineHeight: 1.3 }}>
                Missing chat history.{" "}
                <span
                  style={{
                    color: "var(--accent-dark)",
                    fontWeight: 600,
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                  onClick={() => alert("Syncing previous chat history...")}
                >
                  Restore now
                </span>
              </div>
              <button
                onClick={() => setShowRestoreBanner(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "0.1rem",
                  color: "var(--fg-muted)",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <X size={12} />
              </button>
            </div>
          )}

          {/* Conversation List */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "0 0.5rem 0.5rem",
              minHeight: 220,
              maxHeight: 320,
            }}
          >
            {isLoading ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "3rem 1rem",
                  color: "var(--fg-muted)",
                  gap: "0.5rem",
                }}
              >
                <Loader2 size={24} className="animate-spin" />
                <span style={{ fontSize: "0.8125rem" }}>Loading conversations…</span>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "3.5rem 1rem",
                  color: "var(--fg-muted)",
                  textAlign: "center",
                  gap: "0.75rem",
                }}
              >
                <MessageCircle size={32} style={{ opacity: 0.25 }} />
                <div>
                  <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 600 }}>
                    {searchQuery ? "No matches found" : "No chats yet"}
                  </p>
                  <p style={{ margin: "0.25rem 0 0", fontSize: "0.75rem", color: "var(--fg-muted)" }}>
                    {searchQuery
                      ? "Try searching for a different keyword."
                      : isAdmin
                      ? "Customer conversations will appear here."
                      : "Start a conversation to request help."}
                  </p>
                </div>
                {!isAdmin && conversations.length === 0 && (
                  <button
                    onClick={handleNewMessage}
                    style={{
                      marginTop: "0.25rem",
                      padding: "0.45rem 1rem",
                      borderRadius: "var(--radius-full)",
                      border: "none",
                      background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)",
                      color: "#fff",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      boxShadow: "var(--shadow-sm)",
                    }}
                  >
                    Start chat
                  </button>
                )}
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const otherPartyName = isAdmin
                  ? `Customer #${conv.customerId.slice(-6)}`
                  : "LIMATA Support";
                
                const lastMsg = conv.messages && conv.messages.length > 0 ? conv.messages[0] : null;
                const isUnread = lastMsg && lastMsg.senderId !== user.id;

                const avatarStyle = getAvatarColor(otherPartyName);

                return (
                  <button
                    key={conv.id}
                    onClick={() => {
                      setIsOpen(false);
                      router.push(`/messages/${conv.id}`);
                    }}
                    style={{
                      width: "100%",
                      padding: "0.625rem 0.5rem",
                      border: "none",
                      borderRadius: "var(--radius-md)",
                      background: "transparent",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      textAlign: "left",
                      transition: "background 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "var(--bg-elevated)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                    }}
                  >
                    {/* Avatar Container */}
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: "50%",
                          background: avatarStyle.bg,
                          border: `1.5px solid ${avatarStyle.border}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1rem",
                          fontWeight: 700,
                          color: avatarStyle.text,
                        }}
                      >
                        {otherPartyName[0]?.toUpperCase()}
                      </div>
                      {/* Active green status indicator */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: 2,
                          right: 2,
                          width: 11,
                          height: 11,
                          borderRadius: "50%",
                          background: "#10b981",
                          border: "2px solid var(--bg-surface)",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                        }}
                      />
                    </div>

                    {/* Mid content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.875rem",
                          fontWeight: isUnread ? 700 : 500,
                          color: "var(--fg-primary)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {otherPartyName}
                      </p>
                      
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                          marginTop: "0.15rem",
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            fontSize: "0.8125rem",
                            fontWeight: isUnread ? 600 : 400,
                            color: isUnread ? "var(--fg-primary)" : "var(--fg-muted)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            flex: 1,
                          }}
                        >
                          {lastMsg ? lastMsg.content : "No messages yet"}
                        </p>
                        
                        <span
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--fg-muted)",
                            flexShrink: 0,
                          }}
                        >
                          · {formatRelativeTime(conv.updatedAt)}
                        </span>
                      </div>
                    </div>

                    {/* Unread circle badge */}
                    {isUnread && (
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: "var(--accent, #C9A96E)",
                          flexShrink: 0,
                          alignSelf: "center",
                        }}
                      />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer link: See all in Messenger */}
          <div
            style={{
              padding: "0.75rem",
              borderTop: "1px solid var(--border)",
              textAlign: "center",
              background: "var(--bg-elevated)",
            }}
          >
            <Link
              href="/messages"
              onClick={() => setIsOpen(false)}
              style={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "var(--accent-dark)",
                textDecoration: "none",
                display: "inline-block",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg-primary)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--accent-dark)")}
            >
              See all in Messenger
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
