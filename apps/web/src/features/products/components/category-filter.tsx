"use client";

import { useState } from "react";

const options = ["All", "Living Room", "Bedroom", "Dining Room", "Office", "Storage"];

export function CategoryFilter({ onSelect }: { onSelect: (category?: string) => void }) {
  const [selected, setSelected] = useState<string>("All");

  function change(cat: string) {
    setSelected(cat);
    onSelect(cat === "All" ? undefined : cat);
  }

  return (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
      <span
        style={{
          fontSize: "0.8rem",
          fontWeight: 600,
          color: "var(--fg-muted)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          marginRight: "0.25rem",
          whiteSpace: "nowrap",
        }}
      >
        Filter:
      </span>
      {options.map((opt) => {
        const isActive = selected === opt;
        return (
          <button
            key={opt}
            onClick={() => change(opt)}
            style={{
              padding: "0.375rem 0.875rem",
              borderRadius: "var(--radius-full)",
              fontSize: "0.8125rem",
              fontWeight: isActive ? 600 : 500,
              border: isActive ? "1.5px solid var(--accent)" : "1.5px solid var(--border)",
              background: isActive ? "rgba(201,169,110,0.12)" : "transparent",
              color: isActive ? "var(--accent-dark)" : "var(--fg-secondary)",
              cursor: "pointer",
              transition: "all 0.18s ease",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-light)";
                (e.currentTarget as HTMLElement).style.color = "var(--fg-primary)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLElement).style.color = "var(--fg-secondary)";
              }
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
