"use client";

import { useEffect, useRef } from "react";

export const CATEGORY_CONFIG: { name: string; icon: string }[] = [
  { name: "Living Room", icon: "🛋️" },
  { name: "Bedroom",     icon: "🛏️" },
  { name: "Dining Room", icon: "🍽️" },
  { name: "Office",      icon: "💼" },
  { name: "Outdoor",     icon: "🌿" },
  { name: "Kitchen",     icon: "🍳" },
];

interface CategorySidebarNavProps {
  activeCategory: string | null;
  onCategoryClick: (name: string) => void;
}

export function CategorySidebarNav({ activeCategory, onCategoryClick }: CategorySidebarNavProps) {
  return (
    <nav
      aria-label="Product categories"
      style={{
        position: "sticky",
        top: "5.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.25rem",
        padding: "1.25rem",
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-sm)",
        minWidth: "180px",
        maxWidth: "200px",
        alignSelf: "flex-start",
      }}
    >
      <div
        style={{
          fontSize: "0.7rem",
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--fg-muted)",
          paddingBottom: "0.75rem",
          borderBottom: "1px solid var(--border)",
          marginBottom: "0.5rem",
        }}
      >
        Browse by Room
      </div>

      {CATEGORY_CONFIG.map(({ name, icon }) => {
        const isActive = activeCategory === name;
        return (
          <button
            key={name}
            onClick={() => onCategoryClick(name)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.625rem",
              padding: "0.625rem 0.875rem",
              borderRadius: "var(--radius-md)",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              fontSize: "0.875rem",
              fontWeight: isActive ? 700 : 500,
              color: isActive ? "var(--accent-dark)" : "var(--fg-secondary)",
              background: isActive ? "rgba(201,169,110,0.1)" : "transparent",
              transition: "all 0.18s ease",
              width: "100%",
              fontFamily: "var(--font-sans)",
              position: "relative",
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLElement).style.background = "var(--bg-elevated)";
                (e.currentTarget as HTMLElement).style.color = "var(--fg-primary)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLElement).style.background = "transparent";
                (e.currentTarget as HTMLElement).style.color = "var(--fg-secondary)";
              }
            }}
          >
            {/* Active indicator bar */}
            {isActive && (
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  top: "20%",
                  bottom: "20%",
                  width: "3px",
                  background: "var(--accent)",
                  borderRadius: "var(--radius-full)",
                }}
              />
            )}
            <span style={{ fontSize: "1rem" }}>{icon}</span>
            <span>{name}</span>
          </button>
        );
      })}
    </nav>
  );
}

/** CategoryFilter is kept as a simple export alias for backward compat */
export function CategoryFilter({ onSelect }: { onSelect: (category?: string) => void }) {
  const _ = useRef(onSelect);
  useEffect(() => { _.current = onSelect; }, [onSelect]);
  return null;
}
