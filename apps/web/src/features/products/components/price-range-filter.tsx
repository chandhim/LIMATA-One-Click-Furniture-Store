"use client";

interface PriceRangeFilterProps {
  minPrice: string;
  maxPrice: string;
  onMinChange: (v: string) => void;
  onMaxChange: (v: string) => void;
}

export function PriceRangeFilter({ minPrice, maxPrice, onMinChange, onMaxChange }: PriceRangeFilterProps) {
  const inputStyle: React.CSSProperties = {
    width:        "7rem",
    padding:      "0.5rem 0.75rem",
    background:   "var(--bg-elevated)",
    border:       "1.5px solid var(--border)",
    borderRadius: "var(--radius-md)",
    fontSize:     "0.8125rem",
    color:        "var(--fg-primary)",
    fontFamily:   "var(--font-sans)",
    outline:      "none",
    transition:   "border-color 0.2s, box-shadow 0.2s",
  };

  const focusStyle = {
    borderColor: "var(--accent)",
    boxShadow:   "0 0 0 3px var(--accent-glow)",
  };

  const blurStyle = {
    borderColor: "var(--border)",
    boxShadow:   "none",
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
      <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--fg-muted)", letterSpacing: "0.06em" }}>₹</span>
      <input
        id="product-min-price"
        type="number"
        min={0}
        placeholder="Min"
        value={minPrice}
        onChange={(e) => onMinChange(e.target.value)}
        onFocus={(e)  => Object.assign(e.currentTarget.style, focusStyle)}
        onBlur={(e)   => Object.assign(e.currentTarget.style, blurStyle)}
        style={inputStyle}
      />
      <span style={{ color: "var(--fg-muted)", fontSize: "0.8rem" }}>–</span>
      <input
        id="product-max-price"
        type="number"
        min={0}
        placeholder="Max"
        value={maxPrice}
        onChange={(e) => onMaxChange(e.target.value)}
        onFocus={(e)  => Object.assign(e.currentTarget.style, focusStyle)}
        onBlur={(e)   => Object.assign(e.currentTarget.style, blurStyle)}
        style={inputStyle}
      />
    </div>
  );
}
