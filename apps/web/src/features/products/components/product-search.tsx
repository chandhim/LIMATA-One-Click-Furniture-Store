"use client";

interface ProductSearchProps {
  value:    string;
  onChange: (value: string) => void;
}

export function ProductSearch({ value, onChange }: ProductSearchProps) {
  return (
    <div
      style={{
        position: "relative",
        display:  "flex",
        alignItems: "center",
        background: "var(--bg-elevated)",
        border: "1.5px solid var(--border)",
        borderRadius: "var(--radius-full)",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
      }}
      onFocusCapture={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = "var(--accent)";
        el.style.boxShadow   = "0 0 0 3px var(--accent-glow)";
      }}
      onBlurCapture={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = "var(--border)";
        el.style.boxShadow   = "none";
      }}
    >
      {/* Search icon */}
      <svg
        style={{
          position: "absolute",
          left: "1rem",
          color: "var(--fg-muted)",
          pointerEvents: "none",
          flexShrink: 0,
        }}
        width="16" height="16"
        viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>

      <input
        id="product-search-input"
        type="search"
        placeholder="Search furniture by name or description…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width:       "100%",
          padding:     "0.75rem 1rem 0.75rem 2.75rem",
          background:  "transparent",
          border:      "none",
          outline:     "none",
          fontSize:    "0.9375rem",
          color:       "var(--fg-primary)",
          fontFamily:  "var(--font-sans)",
          borderRadius: "var(--radius-full)",
        }}
      />

      {/* Clear button */}
      {value && (
        <button
          onClick={() => onChange("")}
          title="Clear search"
          style={{
            position:  "absolute",
            right:     "0.875rem",
            background: "var(--border)",
            border:    "none",
            borderRadius: "50%",
            width:     20,
            height:    20,
            display:   "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor:    "pointer",
            color:     "var(--fg-secondary)",
            fontSize:  "0.75rem",
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}
