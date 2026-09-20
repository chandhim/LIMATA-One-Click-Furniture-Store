"use client";

import { ProductCard } from "@/features/products/components/product-card";
import { ProductSkeleton } from "@/features/products/components/product-skeleton";
import type { ProductSummary } from "@/features/products/types/product.types";
import { Sparkles, AlertCircle, SearchX } from "lucide-react";
import type { RecommendationResponse } from "../types/recommendation.types";

export function AiRecommendationView({
  isPending,
  isError,
  data,
  allProducts,
  onClear,
}: {
  isPending: boolean;
  isError: boolean;
  data?: RecommendationResponse;
  allProducts: ProductSummary[];
  onClear: () => void;
}) {
  if (isPending) {
    return (
      <div style={{ marginBottom: "3rem" }}>
        <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.25rem", color: "var(--fg-primary)", marginBottom: "1rem" }}>
          <Sparkles size={20} color="var(--accent)" /> AI is analyzing...
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.375rem" }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ marginBottom: "3rem", padding: "2rem", background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", textAlign: "center" }}>
        <AlertCircle size={32} color="#ef4444" style={{ marginBottom: "1rem", marginInline: "auto" }} />
        <h3 style={{ fontSize: "1.125rem", color: "var(--fg-primary)", marginBottom: "0.5rem" }}>Failed to get recommendations</h3>
        <p style={{ fontSize: "0.9rem", color: "var(--fg-secondary)", marginBottom: "1.5rem" }}>Our AI service is currently unavailable. Please try again later.</p>
        <button onClick={onClear} style={{ padding: "0.5rem 1rem", border: "1px solid var(--border)", background: "transparent", color: "var(--fg-secondary)", borderRadius: "var(--radius-full)", cursor: "pointer" }}>Close</button>
      </div>
    );
  }

  if (!data) return null;

  if (data.recommended_product_ids.length === 0) {
    return (
      <div style={{ marginBottom: "3rem", padding: "3rem 1.5rem", background: "var(--bg-surface)", border: "1.5px dashed var(--border)", borderRadius: "var(--radius-lg)", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem", color: "var(--fg-secondary)" }}>
          <SearchX size={36} />
        </div>
        <h3 style={{ fontSize: "1.125rem", color: "var(--fg-primary)", marginBottom: "0.5rem" }}>No exact matches</h3>
        <p style={{ fontSize: "0.9rem", color: "var(--fg-secondary)", maxWidth: "400px", margin: "0 auto 1.5rem" }}>We couldn&apos;t find products that perfectly match your constraints. Try broadening your criteria (e.g. higher max price).</p>
        <button onClick={onClear} style={{ padding: "0.5rem 1rem", border: "1px solid var(--border)", background: "transparent", color: "var(--fg-secondary)", borderRadius: "var(--radius-full)", cursor: "pointer" }}>Reset Recommendations</button>
      </div>
    );
  }

  // ── Group by score tier ───────────────────────────────────────────
  const recommendedProducts = data.recommended_product_ids
    .map(id => allProducts.find(p => p.productId === id))
    .filter((p): p is ProductSummary => p !== undefined);

  type Group = { label: string; color: string; bg: string; border: string; desc: string; items: ProductSummary[] };
  const groups: Group[] = [
    { label: "Strong Match",  color: "#b45309", bg: "rgba(201,169,110,0.12)", border: "rgba(201,169,110,0.35)", desc: "Perfectly aligned with your preferences",    items: [] },
    { label: "Good Match",    color: "#0e7490", bg: "rgba(6,182,212,0.08)",   border: "rgba(6,182,212,0.30)",   desc: "Solid picks that match your criteria well",  items: [] },
    { label: "Complementary", color: "#6b7280", bg: "rgba(156,163,175,0.08)", border: "rgba(156,163,175,0.28)", desc: "Extra options worth considering",             items: [] },
  ];

  recommendedProducts.forEach((p) => {
    const score = data.matching_info[p.productId]?.score ?? 0;
    if (score >= 70) {
      groups[0].items.push(p);  // Strong Match (>= 70)
    } else if (score >= 50) {
      groups[1].items.push(p);  // Good Match (50 - 69)
    } else if (score >= 40) {
      groups[2].items.push(p);  // Complementary (40 - 49)
    }
    // Items with score < 40 are strictly excluded
  });

  const hasAnyMatches = groups.some((g) => g.items.length > 0);

  if (!hasAnyMatches) {
    return (
      <div style={{ marginBottom: "3rem", padding: "3rem 1.5rem", background: "var(--bg-surface)", border: "1.5px dashed var(--border)", borderRadius: "var(--radius-lg)", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem", color: "var(--fg-secondary)" }}>
          <SearchX size={36} />
        </div>
        <h3 style={{ fontSize: "1.125rem", color: "var(--fg-primary)", marginBottom: "0.5rem" }}>No relevant matches found</h3>
        <p style={{ fontSize: "0.9rem", color: "var(--fg-secondary)", maxWidth: "400px", margin: "0 auto 1.5rem" }}>We couldn&apos;t find furniture matching your query. Try a different search term or adjust your price filter.</p>
        <button onClick={onClear} style={{ padding: "0.5rem 1rem", border: "1px solid var(--border)", background: "transparent", color: "var(--fg-secondary)", borderRadius: "var(--radius-full)", cursor: "pointer" }}>Reset Recommendations</button>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: "3rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.25rem", fontWeight: 700, color: "var(--fg-primary)" }}>
          <Sparkles size={20} color="var(--accent)" /> Top Matches for You
        </h3>
        <button onClick={onClear} style={{ fontSize: "0.85rem", color: "var(--fg-muted)", background: "transparent", border: "none", cursor: "pointer" }}>
          Clear
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
        {groups.filter(g => g.items.length > 0).map((group) => {
          const isStrong = group.label === "Strong Match";
          return (
            <div
              key={group.label}
              style={isStrong ? {
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-strong)",
                borderRadius: "var(--radius-lg)",
                padding: "1.5rem",
                position: "relative",
                overflow: "hidden",
                boxShadow: "var(--shadow-sm)",
              } : {}}
            >
              {/* Accent top stripe for Strong Match */}
              {isStrong && (
                <div style={{
                  position: "absolute",
                  top: 0, left: 0, right: 0,
                  height: "3px",
                  background: "var(--accent)",
                  borderRadius: "var(--radius-lg) var(--radius-lg) 0 0",
                }} />
              )}

              {/* ── Section header ── */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem", paddingBottom: "0.75rem", borderBottom: `1px solid ${group.border}` }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <span style={{ fontSize: "1rem", fontWeight: 700, color: "var(--fg-primary)" }}>{group.label}</span>
                    <span style={{ fontSize: "0.72rem", fontWeight: 700, padding: "0.15rem 0.55rem", borderRadius: "999px", background: group.bg, color: group.color, border: `1px solid ${group.border}`, letterSpacing: "0.03em" }}>
                      {group.items.length} {group.items.length === 1 ? "item" : "items"}
                    </span>
                    {isStrong && (
                      <span style={{ fontSize: "0.68rem", fontWeight: 600, padding: "0.15rem 0.5rem", borderRadius: "999px", background: "var(--accent-light)", color: "var(--accent-dark)", border: "1px solid var(--accent)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                        Best Picks
                      </span>
                    )}
                  </div>
                  <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--fg-secondary)", marginTop: "0.1rem" }}>{group.desc}</p>
                </div>
              </div>

              {/* ── Product grid ── */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: "1.25rem" }}>
                {group.items.map((p) => (
                  <ProductCard key={p.productId} product={p} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ borderBottom: "1px solid var(--border)", margin: "3rem 0" }} />
    </div>
  );
}
