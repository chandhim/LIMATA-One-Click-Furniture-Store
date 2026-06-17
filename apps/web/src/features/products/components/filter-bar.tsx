"use client";

import type { SortOption } from "../types/product.types";
import { SortSelect }       from "./sort-select";
import { PriceRangeFilter } from "./price-range-filter";

const CATEGORIES = ["Living Room", "Bedroom", "Dining Room", "Office", "Storage"];
const MATERIALS  = ["Wood", "Metal", "Fabric", "Leather", "Glass", "Plastic"];

interface FilterBarProps {
  category:    string;
  material:    string;
  minPrice:    string;
  maxPrice:    string;
  inStock:     boolean;
  sort:        SortOption;
  onCategory:  (v: string) => void;
  onMaterial:  (v: string) => void;
  onMinPrice:  (v: string) => void;
  onMaxPrice:  (v: string) => void;
  onInStock:   () => void;
  onSort:      (v: SortOption) => void;
}

const selectStyle: React.CSSProperties = {
  appearance:       "none",
  WebkitAppearance: "none",
  padding:          "0.5rem 1.75rem 0.5rem 0.875rem",
  background:       "var(--bg-elevated)",
  border:           "1.5px solid var(--border)",
  borderRadius:     "var(--radius-full)",
  fontSize:         "0.8125rem",
  fontWeight:       500,
  color:            "var(--fg-primary)",
  fontFamily:       "var(--font-sans)",
  cursor:           "pointer",
  outline:          "none",
  transition:       "border-color 0.2s, box-shadow 0.2s",
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239C9490' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 0.5rem center",
};

const focusHandlers = {
  onFocus: (e: React.FocusEvent<HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "var(--accent)";
    e.currentTarget.style.boxShadow   = "0 0 0 3px var(--accent-glow)";
  },
  onBlur: (e: React.FocusEvent<HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "var(--border)";
    e.currentTarget.style.boxShadow   = "none";
  },
};

export function FilterBar({
  category, material, minPrice, maxPrice, inStock, sort,
  onCategory, onMaterial, onMinPrice, onMaxPrice, onInStock, onSort,
}: FilterBarProps) {
  return (
    <div
      style={{
        display:    "flex",
        flexWrap:   "wrap",
        alignItems: "center",
        gap:        "0.75rem",
        padding:    "0.875rem 1.25rem",
        background: "var(--bg-surface)",
        border:     "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        boxShadow:  "var(--shadow-sm)",
      }}
    >
      {/* Divider label */}
      <span style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.08em", color: "var(--fg-muted)", textTransform: "uppercase", marginRight: "0.25rem" }}>
        Filter
      </span>

      {/* Divider */}
      <div style={{ width: 1, height: 20, background: "var(--border)", flexShrink: 0 }} />

      {/* Category */}
      <select
        id="filter-category"
        value={category}
        onChange={(e) => onCategory(e.target.value)}
        style={selectStyle}
        {...focusHandlers}
      >
        <option value="">All Categories</option>
        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>

      {/* Material */}
      <select
        id="filter-material"
        value={material}
        onChange={(e) => onMaterial(e.target.value)}
        style={selectStyle}
        {...focusHandlers}
      >
        <option value="">All Materials</option>
        {MATERIALS.map((m) => <option key={m} value={m}>{m}</option>)}
      </select>

      {/* Divider */}
      <div style={{ width: 1, height: 20, background: "var(--border)", flexShrink: 0 }} />

      {/* Price Range */}
      <PriceRangeFilter
        minPrice={minPrice}
        maxPrice={maxPrice}
        onMinChange={onMinPrice}
        onMaxChange={onMaxPrice}
      />

      {/* Divider */}
      <div style={{ width: 1, height: 20, background: "var(--border)", flexShrink: 0 }} />

      {/* In Stock toggle */}
      <button
        id="filter-in-stock"
        onClick={onInStock}
        style={{
          display:      "flex",
          alignItems:   "center",
          gap:          "0.375rem",
          padding:      "0.5rem 0.875rem",
          borderRadius: "var(--radius-full)",
          border:       `1.5px solid ${inStock ? "var(--accent)" : "var(--border)"}`,
          background:   inStock ? "rgba(201,169,110,0.1)" : "var(--bg-elevated)",
          color:        inStock ? "var(--accent-dark)"   : "var(--fg-secondary)",
          fontSize:     "0.8125rem",
          fontWeight:   inStock ? 600 : 500,
          cursor:       "pointer",
          transition:   "all 0.18s ease",
          whiteSpace:   "nowrap",
        }}
      >
        <span style={{
          width: 7, height: 7, borderRadius: "50%",
          background: inStock ? "#22c55e" : "var(--border-strong)",
          display: "inline-block", flexShrink: 0,
        }} />
        In Stock
      </button>

      {/* Push sort to right */}
      <div style={{ flex: 1 }} />

      {/* Sort */}
      <SortSelect value={sort} onChange={onSort} />
    </div>
  );
}
