"use client";

import { useNotifications, useMarkNotificationAsRead, useMarkAllNotificationsAsRead } from "@/features/notifications/hooks/use-notifications";
import { Bell, Check, CheckCheck, MessageSquare, Package, CreditCard } from "lucide-react";

function typeColor(type: string): string {
  switch (type) {
    case "CHAT_MESSAGE": return "#6366f1";
    case "SELLER_ORDER_ALERT": return "var(--accent-dark)";
    case "CUSTOMER_ORDER_ALERT": return "#276e47";
    case "PAYMENT_STATUS": return "#276e47";
    case "ORDER_STATUS": return "#a85f10";
    default: return "var(--fg-muted)";
  }
}

function typeLabel(type: string): string {
  switch (type) {
    case "CHAT_MESSAGE": return "Support Chat";
    case "SELLER_ORDER_ALERT": return "Sales Order";
    case "PAYMENT_STATUS": return "Payment Alert";
    case "ORDER_STATUS": return "Order status";
    default: return "System Alert";
  }
}

function TypeIcon({ type, size = 16 }: { type: string; size?: number }) {
  const props = { size };
  switch (type) {
    case "CHAT_MESSAGE": return <MessageSquare {...props} />;
    case "SELLER_ORDER_ALERT": return <Package {...props} />;
    case "PAYMENT_STATUS": return <CreditCard {...props} />;
    default: return <Bell {...props} />;
  }
}

export default function AdminNotificationsPage() {
  const { data: notifications = [], isLoading } = useNotifications();
  const { markAsRead } = useMarkNotificationAsRead();
  const { markAllAsRead } = useMarkAllNotificationsAsRead();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

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
        <span>Loading notifications...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: "2.5rem 2rem", maxWidth: 900, margin: "0 auto", background: "var(--bg-base)", minHeight: "100vh" }}>
      
      {/* Page Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: "2.5rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <span className="section-label">System Logs</span>
          <h1
            className="font-display"
            style={{
              margin: "0.5rem 0 0",
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              fontWeight: 700,
              color: "var(--fg-primary)",
              letterSpacing: "-0.025em",
            }}
          >
            Notification Alerts
            {unreadCount > 0 && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: "0.875rem",
                  minWidth: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: "#dc2626",
                  color: "#fff",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  verticalAlign: "middle",
                  boxShadow: "0 2px 8px rgba(220,38,38,0.3)"
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
            className="btn-ghost"
            style={{
              padding: "0.5rem 1.25rem",
              borderRadius: "var(--radius-full)",
              cursor: "pointer",
              fontSize: "0.8rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <CheckCheck size={14} /> 
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* Notifications List Container */}
      {notifications.length === 0 ? (
        <div 
          style={{ 
            padding: "5rem", 
            textAlign: "center", 
            background: "var(--bg-surface)", 
            border: "1px solid var(--border)", 
            borderRadius: "var(--radius-lg)", 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            gap: "1.25rem",
            boxShadow: "var(--shadow-sm)"
          }}
        >
          <div 
            style={{ 
              width: 56, 
              height: 56, 
              borderRadius: "50%", 
              background: "var(--bg-elevated)", 
              border: "1px solid var(--border)",
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              color: "var(--accent)"
            }}
          >
            <Bell size={24} />
          </div>
          <div>
            <p style={{ margin: "0 0 0.375rem", fontSize: "1rem", fontWeight: 700, color: "var(--fg-primary)" }}>You are all caught up!</p>
            <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--fg-muted)" }}>No admin alerts require attention at this time.</p>
          </div>
        </div>
      ) : (
        <div 
          style={{ 
            background: "var(--bg-surface)", 
            border: "1px solid var(--border)", 
            borderRadius: "var(--radius-lg)", 
            overflow: "hidden",
            boxShadow: "var(--shadow-sm)" 
          }}
        >
          {notifications.map((n, idx) => {
            const color = typeColor(n.type);
            const isUnread = !n.isRead;
            
            return (
              <div
                key={n.notificationId}
                style={{
                  padding: "1.375rem 1.5rem",
                  borderBottom: idx < notifications.length - 1 ? "1px solid var(--border)" : "none",
                  background: isUnread ? "rgba(201,169,110,0.03)" : "transparent",
                  borderLeft: isUnread ? "3px solid var(--accent)" : "3px solid transparent",
                  display: "flex",
                  gap: "1.25rem",
                  alignItems: "flex-start",
                  transition: "background 0.2s ease",
                }}
              >
                {/* Icon Circle */}
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: `${color}10`,
                    border: `1px solid ${color}25`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color,
                    flexShrink: 0,
                  }}
                >
                  <TypeIcon type={n.type} />
                </div>

                {/* Content Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem", marginBottom: "0.375rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span 
                        style={{ 
                          fontSize: "0.65rem", 
                          fontWeight: 700, 
                          textTransform: "uppercase", 
                          letterSpacing: "0.08em", 
                          color, 
                          background: `${color}12`, 
                          padding: "0.15rem 0.45rem", 
                          borderRadius: "4px",
                          border: `1px solid ${color}18`
                        }}
                      >
                        {typeLabel(n.type)}
                      </span>
                      {isUnread && (
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#dc2626" }} />
                      )}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", flexShrink: 0 }}>
                      <span style={{ fontSize: "0.75rem", color: "var(--fg-muted)", fontWeight: 500 }}>
                        {new Date(n.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}{" "}
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {isUnread && (
                        <button
                          onClick={() => markAsRead(n.notificationId)}
                          style={{
                            background: "var(--bg-surface)",
                            border: "1px solid var(--border)",
                            borderRadius: "var(--radius-sm)",
                            padding: "0.2rem 0.5rem",
                            fontSize: "0.72rem",
                            fontWeight: 600,
                            color: "var(--fg-secondary)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.2rem",
                            transition: "all 0.15s ease",
                          }}
                          onMouseEnter={(e) => {
                            const el = e.currentTarget as HTMLElement;
                            el.style.borderColor = "var(--accent)";
                            el.style.color = "var(--accent-dark)";
                            el.style.background = "rgba(201,169,110,0.06)";
                          }}
                          onMouseLeave={(e) => {
                            const el = e.currentTarget as HTMLElement;
                            el.style.borderColor = "var(--border)";
                            el.style.color = "var(--fg-secondary)";
                            el.style.background = "var(--bg-surface)";
                          }}
                        >
                          <Check size={11} /> 
                          <span>Read</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <h3 
                    style={{ 
                      margin: "0 0 0.25rem", 
                      fontSize: "0.9rem", 
                      fontWeight: isUnread ? 700 : 600, 
                      color: "var(--fg-primary)",
                      letterSpacing: "-0.01em" 
                    }}
                  >
                    {n.title}
                  </h3>
                  <p style={{ margin: 0, fontSize: "0.825rem", color: "var(--fg-secondary)", lineHeight: 1.5 }}>
                    {n.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
