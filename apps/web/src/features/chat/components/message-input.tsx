"use client";

import { useState } from "react";
import { Send } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  isSending: boolean;
  disabled?: boolean;
}

export function MessageInput({ onSendMessage, isSending, disabled = false }: MessageInputProps) {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (content.trim()) {
      onSendMessage(content);
      setContent("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-slate-200 p-4 bg-slate-50">
      <div className="flex gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type your message..."
          disabled={isSending || disabled}
          className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isSending || disabled || !content.trim()}
          className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-700 disabled:opacity-50 transition flex items-center gap-2"
        >
          <Send size={16} />
        </button>
      </div>
    </form>
  );
}
