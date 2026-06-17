"use client";

import type { SortOption } from "../types/product.types";

const SORT_LABELS: Record<SortOption, string> = {
  newest:     "Newest",
  price_asc:  "Price ↑",
  price_desc: "Price ↓",
  name_asc:   "Name A–Z",
  name_desc:  "Name Z–A",
};

interface ActiveFilterChipsProps {
  category:     string;
  material:     string;
  minPrice:     string;
  maxPrice:     string;
  inStock:      boolean;
  sort:         SortOption;
  debouncedSearch: string;
  onClearCategory: () => void;
  onClearMaterial: () => void;
  onClearMinPrice: () => void;
  onClearMaxPrice: () => void;
  onClearInStock:  () => void;
  onClearSort:     () => void;
  onClearAll:      () => void;
}

const chipStyle: React.CSSProperties = {
  display:      "inline-flex",
  alignItems:   "center",
  gap:          "0.3rem",
  padding:      "0.3rem 0.625rem 0.3rem 0.75rem",
  background:   "rgba(201,169,110,0.10)",
  border:       "1px solid rgba(201,169,110,0.35)",
  borderRadius: "var(--radius-full)",
  fontSize:     "0.78rem",
  fontWeight:   600,
  color:        "var(--accent-dark)",
  whiteSpace:   "nowrap",
};

const removeBtnStyle: React.CSSProperties = {
  background:   "rgba(168,134,63,0.18)",
  border:       "none",
  borderRadius: "50%",
  width:        16,
  height:       16,
  display:      "flex",
  alignItems:   "center",
  justifyContent: "center",
  cursor:       "pointer",
  color:        "var(--accent-dark)",
  fontSize:     "0.7rem",
  lineHeight:   1,
  padding:      0,
  flexShrink:   0,
};

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span style={chipStyle}>
      {label}
      <button onClick={onRemove} style={removeBtnStyle} title={`Remove ${label}`}>✕</button>
    </span>
  );
}

export function ActiveFilterChips({
  category, material, minPrice, maxPrice, inStock, sort, debouncedSearch,
  onClearCategory, onClearMaterial, onClearMinPrice, onClearMaxPrice,
  onClearInStock, onClearSort, onClearAll,
}: ActiveFilterChipsProps) {
  const hasAny =
    category || material || minPrice || maxPrice || inStock ||
    sort !== "newest" || debouncedSearch;

  if (!hasAny) return null;

  return (
    <div
      style={{
        display:    "flex",
        flexWrap:   "wrap",
        alignItems: "center",
        gap:        "0.5rem",
        animation:  "fadeIn 0.25s ease both",
      }}
    >
      {category  && <Chip label={category}                      onRemove={onClearCategory} />}
      {material  && <Chip label={material}                      onRemove={onClearMaterial} />}
      {minPrice  && <Chip label={`Min ₹${minPrice}`}           onRemove={onClearMinPrice} />}
      {maxPrice  && <Chip label={`Max ₹${maxPrice}`}           onRemove={onClearMaxPrice} />}
      {inStock   && <Chip label="In Stock"                      onRemove={onClearInStock}  />}
      {sort !== "newest" && (
        <Chip label={SORT_LABELS[sort]}                         onRemove={onClearSort}     />
      )}

      {/* Clear All */}
      <button
        onClick={onClearAll}
        style={{
          padding:      "0.3rem 0.75rem",
          background:   "transparent",
          border:       "1px solid var(--border-strong)",
          borderRadius: "var(--radius-full)",
          fontSize:     "0.78rem",
          fontWeight:   500,
          color:        "var(--fg-secondary)",
          cursor:       "pointer",
          transition:   "border-color 0.18s, color 0.18s",
          whiteSpace:   "nowrap",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--accent)";
          e.currentTarget.style.color       = "var(--accent-dark)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--border-strong)";
          e.currentTarget.style.color       = "var(--fg-secondary)";
        }}
      >
        Clear All
      </button>
    </div>
  );
}
