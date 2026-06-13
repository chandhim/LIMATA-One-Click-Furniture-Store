"use client";

import { useState } from "react";
import { useProducts } from "@/features/products/hooks/use-products";
import { ProductGrid } from "@/features/products/components/product-grid";
import { ProductSearch } from "@/features/products/components/product-search";
import { CategoryFilter } from "@/features/products/components/category-filter";
import { ProductSkeleton } from "@/features/products/components/product-skeleton";
import { ProductEmpty } from "@/features/products/components/product-empty";
import { MainLayout } from "@/components/layout/main-layout";

export default function ProductsPage() {
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [category, setCategory] = useState<string | undefined>(undefined);

  const { data, isLoading, isError } = useProducts(search, category);

  return (
    <MainLayout>
      {/* Page Header Band */}
      <div
        style={{
          background: "var(--bg-dark)",
          padding: "4rem 1.5rem 3rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background dot pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle, rgba(250,249,247,0.04) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            pointerEvents: "none",
          }}
        />
        {/* Warm glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: "10%",
            transform: "translateY(-50%)",
            width: "24rem",
            height: "16rem",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(201,169,110,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative" }}>
          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: "0.875rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span style={{ width: "1.5rem", height: "1.5px", background: "var(--accent)", display: "block" }} />
            Our Collection
          </div>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "var(--fg-inverse)",
              lineHeight: 1.1,
              marginBottom: "0.625rem",
            }}
          >
            All Products
          </h1>
          <p style={{ fontSize: "0.9375rem", color: "rgba(250,249,247,0.55)", maxWidth: "28rem" }}>
            2,400+ carefully curated pieces for every room in your home.
          </p>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          background: "var(--bg-base)",
          minHeight: "60vh",
          padding: "2.5rem 1.5rem 4rem",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          {/* Search + Filter Bar */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "2.5rem",
              padding: "1.25rem 1.5rem",
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div style={{ flex: 1, minWidth: "200px" }}>
              <ProductSearch onSearch={(q) => setSearch(q || undefined)} />
            </div>
            <div
              style={{
                width: 1,
                height: 32,
                background: "var(--border)",
                flexShrink: 0,
              }}
            />
            <CategoryFilter onSelect={(c) => setCategory(c)} />
          </div>

          {/* Results info */}
          {!isLoading && data && (
            <div
              style={{
                fontSize: "0.875rem",
                color: "var(--fg-muted)",
                marginBottom: "1.5rem",
              }}
            >
              Showing{" "}
              <strong style={{ color: "var(--fg-primary)", fontWeight: 600 }}>
                {data.length}
              </strong>{" "}
              {data.length === 1 ? "product" : "products"}
              {category && (
                <>
                  {" "}in{" "}
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      background: "rgba(201,169,110,0.12)",
                      color: "var(--accent-dark)",
                      borderRadius: "var(--radius-full)",
                      padding: "0.125rem 0.625rem",
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                    }}
                  >
                    {category}
                    <button
                      onClick={() => setCategory(undefined)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", padding: 0, fontSize: "0.9rem" }}
                    >
                      ×
                    </button>
                  </span>
                </>
              )}
            </div>
          )}

          {/* Skeleton Loading */}
          {isLoading && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: "1.25rem",
              }}
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Error */}
          {isError && (
            <div
              style={{
                textAlign: "center",
                padding: "4rem 2rem",
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>⚠️</div>
              <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--fg-primary)", marginBottom: "0.5rem" }}>
                Unable to load products
              </h3>
              <p style={{ fontSize: "0.9rem", color: "var(--fg-secondary)" }}>
                Please check your connection and try again.
              </p>
            </div>
          )}

          {/* Empty */}
          {!isLoading && data?.length === 0 && <ProductEmpty />}

          {/* Grid */}
          {!isLoading && data && data.length > 0 && <ProductGrid products={data} />}
        </div>
      </div>
    </MainLayout>
  );
}
