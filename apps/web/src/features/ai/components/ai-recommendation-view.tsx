"use client";

import { ProductCard } from "@/features/products/components/product-card";
import { ProductSkeleton } from "@/features/products/components/product-skeleton";
import type { ProductSummary } from "@/features/products/types/product.types";
import { Sparkles, AlertCircle } from "lucide-react";
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
        <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🤔</div>
        <h3 style={{ fontSize: "1.125rem", color: "var(--fg-primary)", marginBottom: "0.5rem" }}>No exact matches</h3>
        <p style={{ fontSize: "0.9rem", color: "var(--fg-secondary)", maxWidth: "400px", margin: "0 auto 1.5rem" }}>We couldn&apos;t find products that perfectly match your constraints. Try broadening your criteria (e.g. higher max price).</p>
        <button onClick={onClear} style={{ padding: "0.5rem 1rem", border: "1px solid var(--border)", background: "transparent", color: "var(--fg-secondary)", borderRadius: "var(--radius-full)", cursor: "pointer" }}>Reset Recommendations</button>
      </div>
    );
  }

  // Resolve products in the EXACT order returned by AI
  const recommendedProducts = data.recommended_product_ids
    .map(id => allProducts.find(p => p.productId === id))
    .filter((p): p is ProductSummary => p !== undefined);

  return (
    <div style={{ marginBottom: "3rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.25rem", fontWeight: 700, color: "var(--fg-primary)" }}>
          <Sparkles size={20} color="var(--accent)" /> Top Matches for You
        </h3>
        <button onClick={onClear} style={{ fontSize: "0.85rem", color: "var(--fg-muted)", background: "transparent", border: "none", cursor: "pointer" }}>
          Clear
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1.25rem" }}>
        {recommendedProducts.map((p) => {
          const info = data.matching_info[p.productId];
          const badge = info ? (
             <div style={{ background: "rgba(28,26,23,0.85)", backdropFilter: "blur(6px)", padding: "0.5rem 0.75rem", borderRadius: "var(--radius-md)", fontSize: "0.75rem", color: "#fff", display: "flex", flexDirection: "column", gap: "0.25rem", border: "1px solid rgba(255,255,255,0.15)", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
               <div style={{ fontWeight: 700, color: "var(--accent)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                 <Sparkles size={12} /> Match Score: {info.score}
               </div>
               {info.reasons.length > 0 && (
                 <ul style={{ margin: 0, paddingLeft: "1.2rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.4 }}>
                   {info.reasons.map((r, i) => <li key={i} style={{ marginBottom: "0.1rem" }}>{r}</li>)}
                 </ul>
               )}
             </div>
          ) : null;

          return <ProductCard key={p.productId} product={p} badge={badge} />;
        })}
      </div>
      
      <div style={{ borderBottom: "1px solid var(--border)", margin: "3rem 0" }} />
    </div>
  );
}
