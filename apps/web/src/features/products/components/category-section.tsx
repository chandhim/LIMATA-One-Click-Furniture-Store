"use client";

import { ProductCard } from "./product-card";
import type { ProductSummary } from "../types/product.types";

interface CategorySectionProps {
  category: string;
  icon: string;
  products: ProductSummary[];
}

export function CategorySection({ category, icon, products }: CategorySectionProps) {
  if (products.length === 0) return null;

  return (
    <section
      id={`section-${category.toLowerCase().replace(/\s+/g, "-")}`}
      style={{ marginBottom: "4rem" }}
    >
      {/* Section Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: "1.75rem",
          paddingBottom: "1.25rem",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: "0.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span
              style={{
                width: "1.5rem",
                height: "1.5px",
                background: "var(--accent)",
                display: "block",
              }}
            />
            {icon} Collection
          </div>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.5rem, 2.5vw, 2.125rem)",
              fontWeight: 700,
              color: "var(--fg-primary)",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            {category}
          </h2>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.8125rem",
            color: "var(--fg-muted)",
            fontWeight: 500,
          }}
        >
          <span
            style={{
              background: "rgba(201,169,110,0.1)",
              color: "var(--accent-dark)",
              borderRadius: "var(--radius-full)",
              padding: "0.25rem 0.75rem",
              fontSize: "0.75rem",
              fontWeight: 700,
            }}
          >
            {products.length} {products.length === 1 ? "piece" : "pieces"}
          </span>
        </div>
      </div>

      {/* Product Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "1.375rem",
        }}
      >
        {products.map((p) => (
          <ProductCard key={p.productId} product={p} />
        ))}
      </div>
    </section>
  );
}
