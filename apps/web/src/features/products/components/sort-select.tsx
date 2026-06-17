"use client";

import type { SortOption } from "../types/product.types";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest",     label: "Newest First" },
  { value: "price_asc",  label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "name_asc",   label: "Name: A → Z" },
  { value: "name_desc",  label: "Name: Z → A" },
];

interface SortSelectProps {
  value:    SortOption;
  onChange: (v: SortOption) => void;
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
      {/* Sort icon */}
      <svg
        style={{
          position:      "absolute",
          left:          "0.75rem",
          pointerEvents: "none",
          color:         "var(--fg-muted)",
          flexShrink:    0,
        }}
        width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      >
        <path d="M3 6h18M7 12h10M11 18h2" />
      </svg>

      <select
        id="product-sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        style={{
          appearance:   "none",
          WebkitAppearance: "none",
          padding:      "0.5rem 2rem 0.5rem 2.25rem",
          background:   "var(--bg-elevated)",
          border:       "1.5px solid var(--border)",
          borderRadius: "var(--radius-full)",
          fontSize:     "0.8125rem",
          fontWeight:   500,
          color:        "var(--fg-primary)",
          fontFamily:   "var(--font-sans)",
          cursor:       "pointer",
          outline:      "none",
          transition:   "border-color 0.2s, box-shadow 0.2s",
          whiteSpace:   "nowrap",
        }}
        onFocus={(e)  => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.boxShadow = "0 0 0 3px var(--accent-glow)"; }}
        onBlur={(e)   => { e.currentTarget.style.borderColor = "var(--border)";  e.currentTarget.style.boxShadow = "none"; }}
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      {/* Chevron */}
      <svg
        style={{ position: "absolute", right: "0.625rem", pointerEvents: "none", color: "var(--fg-muted)" }}
        width="12" height="12" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  );
}
