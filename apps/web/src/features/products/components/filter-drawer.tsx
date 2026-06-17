"use client";

import { useEffect } from "react";
import type { SortOption } from "../types/product.types";
import { SortSelect }       from "./sort-select";
import { PriceRangeFilter } from "./price-range-filter";

const CATEGORIES = ["Living Room", "Bedroom", "Dining Room", "Office", "Storage"];
const MATERIALS  = ["Wood", "Metal", "Fabric", "Leather", "Glass", "Plastic"];

interface FilterDrawerProps {
  open:      boolean;
  onClose:   () => void;
  category:  string;
  material:  string;
  minPrice:  string;
  maxPrice:  string;
  inStock:   boolean;
  sort:      SortOption;
  activeFilterCount: number;
  onCategory:  (v: string) => void;
  onMaterial:  (v: string) => void;
  onMinPrice:  (v: string) => void;
  onMaxPrice:  (v: string) => void;
  onInStock:   () => void;
  onSort:      (v: SortOption) => void;
  onClearAll:  () => void;
}

const sectionLabel: React.CSSProperties = {
  fontSize:      "0.7rem",
  fontWeight:    700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color:         "var(--fg-muted)",
  marginBottom:  "0.625rem",
};

const pillSelectStyle: React.CSSProperties = {
  width:            "100%",
  appearance:       "none",
  WebkitAppearance: "none",
  padding:          "0.625rem 2rem 0.625rem 0.875rem",
  background:       "var(--bg-elevated)",
  border:           "1.5px solid var(--border)",
  borderRadius:     "var(--radius-md)",
  fontSize:         "0.875rem",
  color:            "var(--fg-primary)",
  fontFamily:       "var(--font-sans)",
  outline:          "none",
  cursor:           "pointer",
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239C9490' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
  backgroundRepeat:   "no-repeat",
  backgroundPosition: "right 0.625rem center",
};

export function FilterDrawer({
  open, onClose,
  category, material, minPrice, maxPrice, inStock, sort, activeFilterCount,
  onCategory, onMaterial, onMinPrice, onMaxPrice, onInStock, onSort, onClearAll,
}: FilterDrawerProps) {
  // Lock body scroll while drawer is open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else       document.body.style.overflow = "";
    return ()  => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position:   "fixed",
          inset:      0,
          background: "rgba(28,26,23,0.5)",
          backdropFilter: "blur(4px)",
          zIndex:     1000,
          opacity:    open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.28s ease",
        }}
      />

      {/* Drawer panel */}
      <div
        style={{
          position:   "fixed",
          bottom:     0,
          left:       0,
          right:      0,
          zIndex:     1001,
          background: "var(--bg-surface)",
          borderRadius: "var(--radius-xl) var(--radius-xl) 0 0",
          padding:    "0 1.25rem 2rem",
          maxHeight:  "88vh",
          overflowY:  "auto",
          transform:  open ? "translateY(0)" : "translateY(110%)",
          transition: "transform 0.32s cubic-bezier(0.22,1,0.36,1)",
          boxShadow:  "0 -8px 40px rgba(28,26,23,0.18)",
        }}
      >
        {/* Handle bar */}
        <div style={{ display: "flex", justifyContent: "center", padding: "0.875rem 0 0" }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: "var(--border-strong)" }} />
        </div>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 0 1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", fontWeight: 600, color: "var(--fg-primary)" }}>
              Filters
            </h2>
            {activeFilterCount > 0 && (
              <span style={{
                background: "var(--accent)", color: "#fff",
                borderRadius: "var(--radius-full)", fontSize: "0.7rem",
                fontWeight: 700, padding: "0.15rem 0.5rem",
              }}>
                {activeFilterCount}
              </span>
            )}
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--fg-muted)", padding: "0.25rem", fontSize: "1.25rem" }}>✕</button>
        </div>

        {/* Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* Category */}
          <div>
            <p style={sectionLabel}>Category</p>
            <select value={category} onChange={(e) => onCategory(e.target.value)} style={pillSelectStyle}>
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Material */}
          <div>
            <p style={sectionLabel}>Material</p>
            <select value={material} onChange={(e) => onMaterial(e.target.value)} style={pillSelectStyle}>
              <option value="">All Materials</option>
              {MATERIALS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <p style={sectionLabel}>Price Range</p>
            <PriceRangeFilter minPrice={minPrice} maxPrice={maxPrice} onMinChange={onMinPrice} onMaxChange={onMaxPrice} />
          </div>

          {/* Availability */}
          <div>
            <p style={sectionLabel}>Availability</p>
            <button
              onClick={onInStock}
              style={{
                display:      "flex",
                alignItems:   "center",
                gap:          "0.625rem",
                width:        "100%",
                padding:      "0.75rem 1rem",
                background:   inStock ? "rgba(201,169,110,0.1)" : "var(--bg-elevated)",
                border:       `1.5px solid ${inStock ? "var(--accent)" : "var(--border)"}`,
                borderRadius: "var(--radius-md)",
                cursor:       "pointer",
                textAlign:    "left",
                transition:   "all 0.18s",
              }}
            >
              <span style={{
                width: 18, height: 18, borderRadius: 4, border: `2px solid ${inStock ? "var(--accent)" : "var(--border-strong)"}`,
                background: inStock ? "var(--accent)" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.18s", flexShrink: 0,
              }}>
                {inStock && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>}
              </span>
              <span style={{ fontSize: "0.875rem", fontWeight: 500, color: inStock ? "var(--accent-dark)" : "var(--fg-primary)" }}>
                In Stock Only
              </span>
            </button>
          </div>

          {/* Sort */}
          <div>
            <p style={sectionLabel}>Sort By</p>
            <SortSelect value={sort} onChange={onSort} />
          </div>
        </div>

        {/* Footer actions */}
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "2rem" }}>
          <button
            onClick={() => { onClearAll(); onClose(); }}
            style={{
              flex: 1, padding: "0.875rem",
              background: "transparent",
              border: "1.5px solid var(--border-strong)",
              borderRadius: "var(--radius-md)",
              fontSize: "0.9rem", fontWeight: 600,
              color: "var(--fg-secondary)", cursor: "pointer",
            }}
          >
            Clear All
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 2, padding: "0.875rem",
              background: "var(--fg-primary)",
              border: "none",
              borderRadius: "var(--radius-md)",
              fontSize: "0.9rem", fontWeight: 600,
              color: "var(--fg-inverse)", cursor: "pointer",
            }}
          >
            Show Results
          </button>
        </div>
      </div>
    </>
  );
}
