"use client";

import { useState } from "react";
import type { RecommendationPreferences } from "../types/recommendation.types";
import { Sparkles, Search, SlidersHorizontal } from "lucide-react";

export function AiRecommendationPanel({
  onSubmit,
  onClose,
  initialPreferences
}: {
  onSubmit: (prefs: RecommendationPreferences) => void;
  onClose: () => void;
  initialPreferences?: RecommendationPreferences;
}) {
  const [query, setQuery] = useState(initialPreferences?.query || "");
  const [maxPrice, setMaxPrice] = useState(initialPreferences?.max_price?.toString() || "");
  const [category, setCategory] = useState(initialPreferences?.category || "");
  const [material, setMaterial] = useState(initialPreferences?.material || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      query: query.trim() || undefined,
      max_price: maxPrice ? parseFloat(maxPrice) : undefined,
      category: category || undefined,
      material: material || undefined,
    });
  };

  const hasFilters = query || maxPrice || category || material;

  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1.5px solid rgba(201,169,110,0.3)",
        borderRadius: "var(--radius-xl)",
        padding: "1.5rem",
        marginBottom: "2rem",
        boxShadow: "var(--shadow-md)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Sparkles size={20} color="var(--accent)" />
          <h2 style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--fg-primary)", margin: 0 }}>
            AI Smart Recommendations
          </h2>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--fg-secondary)",
            cursor: "pointer",
            fontSize: "1.25rem",
          }}
        >
          &times;
        </button>
      </div>

      <p style={{ fontSize: "0.9rem", color: "var(--fg-secondary)", marginBottom: "1.5rem" }}>
        Tell us what you&apos;re looking for, and our AI will find the best matches from our catalog based on keywords, materials, and constraints.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {/* Primary Natural Language Query - Full Width & Spacious */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
          <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--fg-primary)" }}>
            Describe what you want
          </label>
          <div style={{ position: "relative", width: "100%" }}>
            <Search
              size={18}
              style={{
                position: "absolute",
                left: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--fg-muted)",
                pointerEvents: "none",
              }}
            />
            <input
              type="text"
              placeholder="My living room is small and I don't want something that makes it feel crowded."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "0.85rem 1rem 0.85rem 2.65rem",
                borderRadius: "var(--radius-lg)",
                border: "1.5px solid var(--border)",
                background: "var(--bg-base)",
                color: "var(--fg-primary)",
                fontSize: "0.95rem",
                outline: "none",
                transition: "border-color 0.2s ease, box-shadow 0.2s ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(201,169,110,0.18)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>
        </div>

        {/* Secondary Optional Filters - Responsive Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1rem",
          }}
        >
          {/* Max Price */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--fg-secondary)" }}>
              Maximum Price (Rs.)
            </label>
            <input
              type="number"
              placeholder="e.g. 50000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              min="0"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "0.65rem 0.75rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border)",
                background: "var(--bg-base)",
                color: "var(--fg-primary)",
                fontSize: "0.9rem",
                outline: "none",
                transition: "border-color 0.2s ease",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            />
          </div>

          {/* Category */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--fg-secondary)" }}>
              Category Preference
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "0.65rem 0.75rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border)",
                background: "var(--bg-base)",
                color: "var(--fg-primary)",
                fontSize: "0.9rem",
                outline: "none",
                transition: "border-color 0.2s ease",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            >
              <option value="">Any Category</option>
              <option value="Living Room">Living Room</option>
              <option value="Bedroom">Bedroom</option>
              <option value="Dining Room">Dining Room</option>
              <option value="Office">Office</option>
              <option value="Outdoor">Outdoor</option>
              <option value="Kitchen">Kitchen</option>
            </select>
          </div>

          {/* Material */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--fg-secondary)" }}>
              Preferred Material
            </label>
            <input
              type="text"
              placeholder="e.g. Wood, Metal, Leather"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "0.65rem 0.75rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border)",
                background: "var(--bg-base)",
                color: "var(--fg-primary)",
                fontSize: "0.9rem",
                outline: "none",
                transition: "border-color 0.2s ease",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            />
          </div>

          {/* Submit Button - Aligned in Second Row */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
            <button
              type="submit"
              disabled={!hasFilters}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                background: hasFilters ? "var(--accent)" : "var(--bg-base)",
                color: hasFilters ? "#fff" : "var(--fg-muted)",
                border: hasFilters ? "none" : "1px solid var(--border)",
                padding: "0.65rem 1.25rem",
                borderRadius: "var(--radius-md)",
                fontSize: "0.9rem",
                fontWeight: 600,
                cursor: hasFilters ? "pointer" : "not-allowed",
                transition: "all 0.2s ease",
                width: "100%",
                height: "39.5px",
                boxSizing: "border-box",
                whiteSpace: "nowrap",
              }}
            >
              <SlidersHorizontal size={16} />
              Find Recommendations
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
