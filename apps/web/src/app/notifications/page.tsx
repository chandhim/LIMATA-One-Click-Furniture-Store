"use client";

import { Bell, Check, CheckCheck, CreditCard, MessageSquare, Package, Star, Zap } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from "@/features/notifications/hooks/use-notifications";
import type { NotificationType } from "@/features/notifications/types/notification.types";

function typeColor(type: NotificationType): string {
  switch (type) {
    case "CHAT_MESSAGE":      return "#6366f1";
    case "ORDER_STATUS":      return "var(--accent-dark)";
    case "PAYMENT_STATUS":    return "#10b981";
    case "REVIEW_STATUS":     return "#f59e0b";
    case "AI_RECOMMENDATION": return "#8b5cf6";
    default:                   return "var(--fg-secondary)";
  }
}

function typeLabel(type: NotificationType): string {
  switch (type) {
    case "CHAT_MESSAGE":      return "Message";
    case "ORDER_STATUS":      return "Order";
    case "PAYMENT_STATUS":    return "Payment";
    case "REVIEW_STATUS":     return "Review";
    case "AI_RECOMMENDATION": return "AI Tip";
    default:                   return "System";
  }
}

function TypeIcon({ type, size = 18 }: { type: NotificationType; size?: number }) {
  const props = { size };
  switch (type) {
    case "CHAT_MESSAGE":      return <MessageSquare {...props} />;
    case "ORDER_STATUS":      return <Package {...props} />;
    case "PAYMENT_STATUS":    return <CreditCard {...props} />;
    case "REVIEW_STATUS":     return <Star {...props} />;
    case "AI_RECOMMENDATION": return <Zap {...props} />;
    default:                   return <Bell {...props} />;
  }
}

export default function NotificationsPage() {
  const { data: notifications = [], isLoading } = useNotifications();
  const { markAsRead } = useMarkNotificationAsRead();
  const { markAllAsRead } = useMarkAllNotificationsAsRead();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

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
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "2rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <span className="section-label">Activity</span>
            <h1
              style={{
                margin: "0.5rem 0 0",
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(1.5rem, 4vw, 2rem)",
                fontWeight: 700,
                color: "var(--fg-primary)",
              }}
            >
              Notifications
              {unreadCount > 0 && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: "0.75rem",
                    minWidth: 26,
                    height: 26,
                    borderRadius: "var(--radius-full)",
                    background: "#e74c3c",
                    color: "#fff",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    verticalAlign: "middle",
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </h1>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={() => markAllAsRead()}
              style={{
                padding: "0.625rem 1.125rem",
                border: "1.5px solid var(--border)",
                borderRadius: "var(--radius-full)",
                background: "transparent",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "var(--fg-secondary)",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)";
                (e.currentTarget as HTMLElement).style.color = "var(--accent-dark)";
                (e.currentTarget as HTMLElement).style.background = "var(--accent-glow)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLElement).style.color = "var(--fg-secondary)";
                (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              <CheckCheck size={15} /> Mark all as read
            </button>
          )}
        </div>

        {/* Content */}
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
            <div
              style={{
                width: 24,
                height: 24,
                border: "2.5px solid var(--border)",
                borderTopColor: "var(--accent)",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
            <span>Loading notifications…</span>
          </div>
        ) : notifications.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: "5rem",
              gap: "1.5rem",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Bell size={32} color="var(--fg-muted)" style={{ opacity: 0.4 }} />
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
                You&apos;re all caught up!
              </p>
              <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--fg-muted)" }}>
                No notifications to show right now.
              </p>
            </div>
          </div>
        ) : (
          <div
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              boxShadow: "var(--shadow-sm)",
            }}
          >            {notifications.map((n, index) => {
              const color = typeColor(n.type);
              return (
                <div
                  key={n.notificationId}
                  style={{
                    padding: "1rem 1.25rem",
                    borderBottom:
                      index < notifications.length - 1
                        ? "1px solid var(--border)"
                        : "none",
                    background: !n.isRead ? `${color}06` : "transparent",
                    display: "flex",
                    gap: "1rem",
                    alignItems: "flex-start",
                    transition: "background 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (n.isRead)
                      (e.currentTarget as HTMLElement).style.background =
                        "var(--bg-elevated)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = !n.isRead
                      ? `${color}06`
                      : "transparent";
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: `${color}15`,
                      border: `1.5px solid ${color}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color,
                      flexShrink: 0,
                    }}
                  >
                    <TypeIcon type={n.type} />
                  </div>
 
                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: "0.5rem",
                        marginBottom: "0.25rem",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                        <span
                          style={{
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            color,
                            background: `${color}15`,
                            padding: "0.1rem 0.4rem",
                            borderRadius: "var(--radius-sm)",
                          }}
                        >
                          {typeLabel(n.type)}
                        </span>
                        {!n.isRead && (
                          <span
                            style={{
                              width: 7,
                              height: 7,
                              borderRadius: "50%",
                              background: "#e74c3c",
                              display: "inline-block",
                            }}
                          />
                        )}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
                        <span style={{ fontSize: "0.75rem", color: "var(--fg-muted)", whiteSpace: "nowrap" }}>
                          {new Date(n.createdAt).toLocaleString([], {
                             month: "short",
                             day: "numeric",
                             hour: "2-digit",
                             minute: "2-digit",
                          })}
                        </span>
                        {!n.isRead && (
                          <button
                            onClick={() => markAsRead(n.notificationId)}
                            title="Mark as read"
                            style={{
                              background: "none",
                              border: "1px solid var(--border)",
                              borderRadius: "var(--radius-sm)",
                              cursor: "pointer",
                              color: "var(--fg-muted)",
                              padding: "0.2rem 0.4rem",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.25rem",
                              fontSize: "0.7rem",
                              fontWeight: 500,
                              transition: "all 0.15s ease",
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLElement).style.borderColor = color;
                              (e.currentTarget as HTMLElement).style.color = color;
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                              (e.currentTarget as HTMLElement).style.color = "var(--fg-muted)";
                            }}
                          >
                            <Check size={11} /> Read
                          </button>
                        )}
                      </div>
                    </div>
                    <h3
                      style={{
                        margin: "0 0 0.25rem",
                        fontSize: "0.9rem",
                        fontWeight: n.isRead ? 500 : 700,
                        color: "var(--fg-primary)",
                        lineHeight: 1.4,
                      }}
                    >
                      {n.title}
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.8125rem",
                        color: "var(--fg-secondary)",
                        lineHeight: 1.55,
                      }}
                    >
                      {n.message}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </MainLayout>
  );
}
