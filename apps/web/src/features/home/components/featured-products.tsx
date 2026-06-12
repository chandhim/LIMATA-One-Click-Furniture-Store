"use client";

import { ProductCard } from "@/features/products/components/product-card";
import Link from "next/link";

const R2 = "https://pub-cc6bc0ad895f4273912e59614e1effe0.r2.dev";

const samples = [
  { id: "1", name: "Modern Sofa",         price: 45000, category: "Living Room", images: [`${R2}/products/modern-sofa.png`],   stock: 10 },
  { id: "2", name: "Wooden Dining Table", price: 30000, category: "Dining Room", images: [`${R2}/products/dining-table.png`],  stock: 5  },
  { id: "3", name: "Office Chair",        price: 8000,  category: "Office",      images: [`${R2}/products/office-chair.png`],  stock: 20 },
  { id: "4", name: "Queen Bed Frame",     price: 40000, category: "Bedroom",     images: [`${R2}/products/queen-bed.png`],     stock: 3  },
];

export function FeaturedProducts() {
  return (
    <section
      style={{
        background: "var(--bg-surface)",
        padding: "7rem 2rem",
        position: "relative",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Section header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "1.5rem",
            marginBottom: "3rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div className="section-label animate-fade-up" style={{ marginBottom: "1rem" }}>
              Editor's Pick
            </div>
            <h2
              className="font-display animate-fade-up delay-100"
              style={{
                fontSize: "clamp(2rem, 3.5vw, 2.875rem)",
                fontWeight: 700,
                letterSpacing: "-0.025em",
                color: "var(--fg-primary)",
                lineHeight: 1.15,
              }}
            >
              Featured Products
            </h2>
          </div>

          <Link
            href="/products"
            className="animate-fade-up delay-200"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "var(--accent-dark)",
              textDecoration: "none",
              borderBottom: "1.5px solid var(--accent-light)",
              paddingBottom: "2px",
              transition: "gap 0.2s ease, border-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.gap = "0.75rem";
              (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.gap = "0.5rem";
              (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-light)";
            }}
          >
            View all products
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

        {/* Product Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {samples.map((p) => (
            // @ts-ignore
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
