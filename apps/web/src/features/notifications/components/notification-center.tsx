"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  MessageSquare,
  Package,
  CreditCard,
  Star,
  Zap,
} from "lucide-react";
import {
  useNotifications,
  useUnreadCount,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from "../hooks/use-notifications";
import type {
  Notification,
  NotificationType,
} from "../types/notification.types";

// Icon by notification type
function NotifIcon({ type }: { type: NotificationType }) {
  const iconProps = { size: 14 };
  switch (type) {
    case "CHAT_MESSAGE":
      return <MessageSquare {...iconProps} />;
    case "ORDER_STATUS":
      return <Package {...iconProps} />;
    case "PAYMENT_STATUS":
      return <CreditCard {...iconProps} />;
    case "REVIEW_STATUS":
      return <Star {...iconProps} />;
    case "AI_RECOMMENDATION":
      return <Zap {...iconProps} />;
    default:
      return <Bell {...iconProps} />;
  }
}

function typeColor(type: NotificationType): string {
  switch (type) {
    case "CHAT_MESSAGE":
      return "#6366f1";
    case "ORDER_STATUS":
      return "var(--accent-dark)";
    case "PAYMENT_STATUS":
      return "#10b981";
    case "REVIEW_STATUS":
      return "#f59e0b";
    case "AI_RECOMMENDATION":
      return "#8b5cf6";
    default:
      return "var(--fg-secondary)";
  }
}

function NotificationItem({
  notification,
  onMarkAsRead,
}: {
  notification: Notification;
  onMarkAsRead: (notificationId: string) => void;
}) {
  const color = typeColor(notification.type);

  return (
    <div
      style={{
        padding: "0.75rem 1rem",
        borderBottom: "1px solid var(--border)",
        background: !notification.isRead ? `${color}08` : "transparent",
        display: "flex",
        gap: "0.75rem",
        transition: "background 0.15s ease",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        if (notification.isRead)
          (e.currentTarget as HTMLElement).style.background =
            "var(--bg-elevated)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = !notification.isRead
          ? `${color}08`
          : "transparent";
      }}
    >
      {/* Icon badge */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: `${color}18`,
          border: `1px solid ${color}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color,
          flexShrink: 0,
          marginTop: "0.1rem",
        }}
      >
        <NotifIcon type={notification.type} />
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "0.5rem",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "0.8125rem",
              fontWeight: notification.isRead ? 400 : 600,
              color: "var(--fg-primary)",
              lineHeight: 1.4,
            }}
          >
            {notification.title}
          </p>
          {!notification.isRead && (
            <button
              onClick={() => onMarkAsRead(notification.notificationId)}
              title="Mark as read"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--fg-muted)",
                padding: "0.1rem",
                borderRadius: "var(--radius-sm)",
                display: "flex",
                alignItems: "center",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = color;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color =
                  "var(--fg-muted)";
              }}
            >
              <Check size={13} />
            </button>
          )}
        </div>
        <p
          style={{
            margin: "0.2rem 0 0",
            fontSize: "0.75rem",
            color: "var(--fg-secondary)",
            lineHeight: 1.4,
          }}
        >
          {notification.message}
        </p>
        <span
          style={{
            fontSize: "0.7rem",
            color: "var(--fg-muted)",
            display: "block",
            marginTop: "0.25rem",
          }}
        >
          {new Date(notification.createdAt).toLocaleString([], {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      {/* Unread dot */}
      {!notification.isRead && (
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: color,
            flexShrink: 0,
            marginTop: "0.45rem",
          }}
        />
      )}
    </div>
  );
}

// ── Main Notification Bell + Dropdown ───────────────────────────────────────

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<"all" | "unread">("all");
  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = useUnreadCount();
  const { data: notifications = [] } = useNotifications();
  const { markAsRead } = useMarkNotificationAsRead();
  const { markAllAsRead } = useMarkAllNotificationsAsRead();

  const displayed =
    tab === "unread" ? notifications.filter((n) => !n.isRead) : notifications;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  return (
    <div ref={panelRef} style={{ position: "relative" }}>
      {/* Bell button */}
      <button
        id="notification-bell-btn"
        onClick={() => setIsOpen((v) => !v)}
        aria-label="Notifications"
        style={{
          position: "relative",
          width: 38,
          height: 38,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: isOpen ? "var(--bg-elevated)" : "transparent",
          border: "1.5px solid " + (isOpen ? "var(--border)" : "transparent"),
          cursor: "pointer",
          color: "var(--fg-secondary)",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background =
            "var(--bg-elevated)";
          (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
          (e.currentTarget as HTMLElement).style.color = "var(--fg-primary)";
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.borderColor = "transparent";
          }
          (e.currentTarget as HTMLElement).style.color = "var(--fg-secondary)";
        }}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: 2,
              right: 2,
              minWidth: 16,
              height: 16,
              borderRadius: "var(--radius-full)",
              background: "#e74c3c",
              color: "#fff",
              fontSize: "0.6rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 3px",
              border: "2px solid var(--bg-base)",
              animation: "pulse-ring 1.5s ease-out infinite",
            }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div
          id="notification-dropdown"
          className="animate-slide-down"
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: 360,
            background: "var(--bg-surface)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-lg)",
            border: "1px solid var(--border)",
            overflow: "hidden",
            zIndex: 200,
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "0.875rem 1rem",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "0.9375rem",
                  fontWeight: 700,
                  color: "var(--fg-primary)",
                  fontFamily: "var(--font-serif)",
                }}
              >
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span
                  style={{
                    background: "#e74c3c",
                    color: "#fff",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    borderRadius: "var(--radius-full)",
                    padding: "0.1rem 0.375rem",
                  }}
                >
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead()}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  color: "var(--fg-muted)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  borderRadius: "var(--radius-sm)",
                  padding: "0.25rem 0.375rem",
                  transition: "color 0.2s ease, background 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    "var(--accent-dark)";
                  (e.currentTarget as HTMLElement).style.background =
                    "var(--accent-glow)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    "var(--fg-muted)";
                  (e.currentTarget as HTMLElement).style.background =
                    "transparent";
                }}
              >
                <CheckCheck size={13} />
                Mark all read
              </button>
            )}
          </div>

          {/* Tabs */}
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid var(--border)",
              padding: "0 0.75rem",
              gap: "0.25rem",
            }}
          >
            {(["all", "unread"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: "0.5rem 0.75rem",
                  border: "none",
                  borderBottom:
                    tab === t
                      ? "2px solid var(--accent)"
                      : "2px solid transparent",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  fontWeight: tab === t ? 600 : 400,
                  color: tab === t ? "var(--fg-primary)" : "var(--fg-muted)",
                  transition: "all 0.2s ease",
                  textTransform: "capitalize",
                }}
              >
                {t === "unread"
                  ? `Unread${unreadCount > 0 ? ` (${unreadCount})` : ""}`
                  : `All (${notifications.length})`}
              </button>
            ))}
          </div>

          {/* Notification list */}
          <div style={{ maxHeight: 380, overflowY: "auto" }}>
            {displayed.length === 0 ? (
              <div
                style={{
                  padding: "2.5rem 1rem",
                  textAlign: "center",
                  color: "var(--fg-muted)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <Bell size={30} style={{ opacity: 0.25 }} />
                <p style={{ margin: 0, fontSize: "0.875rem" }}>
                  {tab === "unread"
                    ? "No unread notifications"
                    : "No notifications yet"}
                </p>
              </div>
            ) : (
              displayed.map((n) => (
                <NotificationItem
                  key={n.notificationId}
                  notification={n}
                  onMarkAsRead={markAsRead}
                />
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div
              style={{
                padding: "0.625rem 1rem",
                borderTop: "1px solid var(--border)",
                background: "var(--bg-elevated)",
                textAlign: "center",
              }}
            >
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "var(--fg-muted)",
                }}
              >
                Showing {displayed.length} of {notifications.length}{" "}
                notifications
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
