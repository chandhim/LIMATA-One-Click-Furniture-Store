"use client";

import { useRef } from "react";

interface ProductSearchProps {
  onSearch: (query: string) => void;
}

export function ProductSearch({ onSearch }: ProductSearchProps) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
      <svg
        style={{
          position: "absolute",
          left: "0.875rem",
          color: "var(--fg-muted)",
          pointerEvents: "none",
          flexShrink: 0,
        }}
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        ref={ref}
        type="search"
        placeholder="Search furniture..."
        onChange={(e) => onSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "0.625rem 0.875rem 0.625rem 2.5rem",
          background: "transparent",
          border: "none",
          outline: "none",
          fontSize: "0.9rem",
          color: "var(--fg-primary)",
          fontFamily: "var(--font-sans)",
        }}
      />
    </div>
  );
}
