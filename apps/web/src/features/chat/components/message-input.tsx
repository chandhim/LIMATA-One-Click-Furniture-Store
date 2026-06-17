"use client";

import { useState } from "react";
import { Send } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  isSending: boolean;
  disabled?: boolean;
}

export function MessageInput({
  onSendMessage,
  isSending,
  disabled = false,
}: MessageInputProps) {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (content.trim()) {
      onSendMessage(content);
      setContent("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ 
        borderTop: "1px solid var(--border)", 
        padding: "1.25rem 1.5rem", 
        background: "var(--bg-surface)" 
      }}
    >
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type your reply to the customer..."
          disabled={isSending || disabled}
          className="input-base"
          style={{ 
            flex: 1, 
            fontSize: "0.875rem",
            padding: "0.625rem 1rem"
          }}
        />
        <button
          type="submit"
          disabled={isSending || disabled || !content.trim()}
          className="btn-shimmer"
          style={{
            padding: "0.625rem 1.25rem",
            color: "var(--fg-primary)",
            border: "none",
            borderRadius: "var(--radius-full)",
            cursor: (isSending || disabled || !content.trim()) ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.375rem",
            transition: "all 0.2s ease",
            opacity: (isSending || disabled || !content.trim()) ? 0.5 : 1,
            boxShadow: (isSending || disabled || !content.trim()) ? "none" : "var(--shadow-accent)",
          }}
        >
          <Send size={14} />
          <span style={{ fontSize: "0.8rem", fontWeight: 700 }}>Send</span>
        </button>
      </div>
    </form>
  );
}
