import React from "react";
import { AlertCircle, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isDestructive = true,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "1rem",
        animation: "fadeIn 0.2s ease-out",
      }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg-surface)",
          borderRadius: "var(--radius-lg)",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "var(--shadow-xl)",
          overflow: "hidden",
          animation: "slideUp 0.3s ease-out",
          border: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            padding: "1.5rem",
            display: "flex",
            alignItems: "flex-start",
            gap: "1rem",
          }}
        >
          <div
            style={{
              padding: "0.5rem",
              background: isDestructive
                ? "rgba(239, 68, 68, 0.1)"
                : "rgba(59, 130, 246, 0.1)",
              color: isDestructive ? "#ef4444" : "#3b82f6",
              borderRadius: "50%",
              flexShrink: 0,
            }}
          >
            <AlertCircle size={24} />
          </div>
          <div style={{ flex: 1, marginTop: "0.2rem" }}>
            <h3
              style={{
                fontSize: "1.125rem",
                fontWeight: 600,
                color: "var(--fg-primary)",
                marginBottom: "0.5rem",
              }}
            >
              {title}
            </h3>
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--fg-secondary)",
                lineHeight: 1.5,
              }}
            >
              {message}
            </p>
          </div>
          <button
            onClick={onCancel}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--fg-muted)",
              cursor: "pointer",
              padding: "0.25rem",
              borderRadius: "var(--radius-md)",
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div
          style={{
            padding: "1rem 1.5rem",
            background: "var(--bg-muted)",
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.75rem",
            borderTop: "1px solid var(--border)",
          }}
        >
          <button
            onClick={onCancel}
            style={{
              padding: "0.5rem 1rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "var(--fg-primary)",
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "0.5rem 1rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "#fff",
              background: isDestructive ? "#ef4444" : "var(--accent)",
              border: "none",
              borderRadius: "var(--radius-md)",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
