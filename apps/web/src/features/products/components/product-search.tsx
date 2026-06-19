"use client";

import { useRef } from "react";

interface ProductSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  large?: boolean;
}

export function ProductSearch({
  onSearch,
  placeholder = "Search by name, category, or material...",
  large = false,
}: ProductSearchProps) {
  const ref = useRef<HTMLInputElement>(null);

  const height = large ? "3.25rem" : "2.625rem";
  const fontSize = large ? "1rem" : "0.9rem";
  const iconSize = large ? 18 : 16;
  const iconLeft = large ? "1.125rem" : "0.875rem";
  const inputPadding = large
    ? "0 1.125rem 0 3rem"
    : "0 0.875rem 0 2.5rem";

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        background: large ? "rgba(255,255,255,0.08)" : "transparent",
        backdropFilter: large ? "blur(12px)" : "none",
        border: large ? "1.5px solid rgba(255,255,255,0.15)" : "none",
        borderRadius: "var(--radius-full)",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
      }}
      onFocusCapture={(e) => {
        if (large) {
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,169,110,0.55)";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 4px rgba(201,169,110,0.12)";
        }
      }}
      onBlurCapture={(e) => {
        if (large) {
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)";
          (e.currentTarget as HTMLElement).style.boxShadow = "none";
        }
      }}
    >
      {/* Search icon */}
      <svg
        style={{
          position: "absolute",
          left: iconLeft,
          color: large ? "rgba(250,249,247,0.5)" : "var(--fg-muted)",
          pointerEvents: "none",
          flexShrink: 0,
        }}
        width={iconSize}
        height={iconSize}
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
        placeholder={placeholder}
        onChange={(e) => onSearch(e.target.value)}
        style={{
          width: "100%",
          height,
          padding: inputPadding,
          background: "transparent",
          border: large ? "none" : "none",
          outline: "none",
          fontSize,
          fontFamily: "var(--font-sans)",
          color: large ? "var(--fg-inverse)" : "var(--fg-primary)",
          fontWeight: 400,
        }}
      />
    </div>
  );
}
