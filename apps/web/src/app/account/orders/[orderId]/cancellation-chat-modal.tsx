"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X } from "lucide-react";

interface CancellationChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmCancel: (reason: string) => void;
  isCancelling: boolean;
  orderStatus?: string;
  orderId?: string;
}

export function CancellationChatModal({
  isOpen,
  onClose,
  onConfirmCancel,
  isCancelling,
  orderStatus,
  orderId,
}: CancellationChatModalProps) {
  const [messages, setMessages] = useState<{ sender: "bot" | "user"; text: string }[]>([
    { sender: "bot", text: "We're sorry to see you cancel. Could you tell us why?" },
  ]);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  
  const reasons = [
    "I changed my mind",
    "Found a better price elsewhere",
    "Ordered by mistake",
    "Delivery takes too long",
    "Other",
  ];

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      if (orderStatus === "SHIPPED") {
        setMessages([
          { sender: "bot", text: "This order has already been shipped and cannot be cancelled directly. Would you like to contact support to request a cancellation?" }
        ]);
      } else {
        setMessages([{ sender: "bot", text: "We're sorry to see you cancel. Could you tell us why?" }]);
      }
      setSelectedReason(null);
    }
  }, [isOpen, orderStatus]);

  if (!isOpen) return null;

  const handleReasonSelect = (reason: string) => {
    setSelectedReason(reason);
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: reason },
      { sender: "bot", text: "Thank you for letting us know. Are you sure you want to proceed with the cancellation?" },
    ]);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        style={{
          background: "var(--bg-surface)",
          width: "100%",
          maxWidth: "400px",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          boxShadow: "var(--shadow-lg)",
          display: "flex",
          flexDirection: "column",
          border: "1px solid var(--border)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "1rem 1.5rem",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "var(--bg-elevated)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <MessageSquare size={18} style={{ color: "var(--accent)" }} />
            <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>Cancel Order</h3>
          </div>
          <button
            onClick={onClose}
            disabled={isCancelling}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--fg-muted)",
              cursor: isCancelling ? "not-allowed" : "pointer",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Chat Area */}
        <div
          style={{
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            height: "300px",
            overflowY: "auto",
            background: "var(--bg-base)",
          }}
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                justifyContent: msg.sender === "bot" ? "flex-start" : "flex-end",
              }}
            >
              <div
                style={{
                  maxWidth: "80%",
                  padding: "0.75rem 1rem",
                  borderRadius: "1rem",
                  background: msg.sender === "bot" ? "var(--bg-elevated)" : "var(--accent)",
                  color: msg.sender === "bot" ? "var(--fg-primary)" : "var(--fg-inverse)",
                  borderBottomLeftRadius: msg.sender === "bot" ? "0.25rem" : "1rem",
                  borderBottomRightRadius: msg.sender === "user" ? "0.25rem" : "1rem",
                  fontSize: "0.875rem",
                  boxShadow: "var(--shadow-sm)",
                  border: msg.sender === "bot" ? "1px solid var(--border)" : "none",
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Action Area */}
        <div
          style={{
            padding: "1.5rem",
            borderTop: "1px solid var(--border)",
            background: "var(--bg-elevated)",
          }}
        >
          {!selectedReason && orderStatus !== "SHIPPED" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {reasons.map((reason) => (
                <button
                  key={reason}
                  onClick={() => handleReasonSelect(reason)}
                  style={{
                    padding: "0.75rem",
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    fontSize: "0.875rem",
                    color: "var(--fg-primary)",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--accent)";
                    e.currentTarget.style.background = "var(--bg-base)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.background = "var(--bg-surface)";
                  }}
                >
                  {reason}
                </button>
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                onClick={onClose}
                disabled={isCancelling}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  color: "var(--fg-primary)",
                  fontWeight: 600,
                  cursor: isCancelling ? "not-allowed" : "pointer",
                }}
              >
                Keep Order
              </button>
              {orderStatus === "SHIPPED" ? (
                <button
                  onClick={() => {
                    onClose();
                    window.dispatchEvent(new CustomEvent("open-chat", { detail: { initialMessage: `Cancellation request for order #${orderId}` } }));
                  }}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    background: "var(--accent)",
                    border: "none",
                    borderRadius: "var(--radius-md)",
                    color: "white",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  Contact Support
                </button>
              ) : (
                <button
                  onClick={() => onConfirmCancel(selectedReason!)}
                  disabled={isCancelling}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    background: "#dc2626",
                    border: "none",
                    borderRadius: "var(--radius-md)",
                    color: "white",
                    fontWeight: 600,
                    cursor: isCancelling ? "not-allowed" : "pointer",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  {isCancelling ? "Cancelling..." : "Confirm Cancel"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
