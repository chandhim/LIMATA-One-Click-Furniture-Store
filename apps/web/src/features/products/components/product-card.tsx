"use client";

import Link from "next/link";
import type { ProductSummary } from "../types/product.types";

export function ProductCard({ product }: { product: ProductSummary }) {
  const categoryEmoji: Record<string, string> = {
    "Living Room": "🛋️",
    Bedroom: "🛏️",
    "Dining Room": "🍽️",
    Office: "💼",
    Storage: "📦",
  };
  const emoji = categoryEmoji[product.category] ?? "🪑";

  return (
    <Link
      href={`/products/${product.id}`}
      style={{
        display: "block",
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        textDecoration: "none",
        color: "inherit",
        transition:
          "transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease, border-color 0.3s ease",
        boxShadow: "var(--shadow-sm)",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translateY(-6px)";
        el.style.boxShadow = "var(--shadow-lg)";
        el.style.borderColor = "var(--accent-light)";
        const overlay = el.querySelector(".quick-view-overlay") as HTMLElement;
        if (overlay) overlay.style.opacity = "1";
        const img = el.querySelector(".product-card-image") as HTMLElement;
        if (img) img.style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "var(--shadow-sm)";
        el.style.borderColor = "var(--border)";
        const overlay = el.querySelector(".quick-view-overlay") as HTMLElement;
        if (overlay) overlay.style.opacity = "0";
        const img = el.querySelector(".product-card-image") as HTMLElement;
        if (img) img.style.transform = "scale(1)";
      }}
    >
      {/* Image / Visual Area */}
      <div
        style={{
          height: "13rem",
          background: "linear-gradient(135deg, #F5EFE6 0%, #EDE0CC 100%)",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "4rem",
          overflow: "hidden",
        }}
      >
        {product.images && product.images.length > 0 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.images[0]}
            alt={product.name}
            className="product-card-image"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s ease",
            }}
          />
        ) : (
          <span style={{ opacity: 0.45, transition: "transform 0.4s ease" }}>
            {emoji}
          </span>
        )}

        {/* Gradient overlay on hover */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(28,26,23,0.08), transparent)",
          }}
        />

        {/* Quick View Overlay */}
        <div
          className="quick-view-overlay"
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(28,26,23,0.45)",
            backdropFilter: "blur(3px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0,
            transition: "opacity 0.25s ease",
          }}
        >
          <div
            style={{
              background: "var(--bg-surface)",
              borderRadius: "var(--radius-full)",
              padding: "0.625rem 1.375rem",
              fontSize: "0.8125rem",
              fontWeight: 600,
              color: "var(--fg-primary)",
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            Quick View
          </div>
        </div>

        {/* Stock badge */}
        <div
          style={{
            position: "absolute",
            top: "0.75rem",
            left: "0.75rem",
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(6px)",
            borderRadius: "var(--radius-full)",
            padding: "0.3rem 0.625rem",
            fontSize: "0.7rem",
            fontWeight: 600,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: product.stock > 0 ? "#22c55e" : "#ef4444",
              display: "inline-block",
            }}
          />
          <span style={{ color: product.stock > 0 ? "#166534" : "#991b1b" }}>
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "1.125rem 1.25rem 1.375rem" }}>
        {/* Category badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.25rem",
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--accent-dark)",
            background: "rgba(201,169,110,0.12)",
            borderRadius: "var(--radius-full)",
            padding: "0.25rem 0.625rem",
            marginBottom: "0.625rem",
          }}
        >
          {product.category}
        </div>

        <h3
          style={{
            fontSize: "0.9375rem",
            fontWeight: 600,
            color: "var(--fg-primary)",
            letterSpacing: "-0.01em",
            marginBottom: "0.5rem",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {product.name}
        </h3>

        {/* Price row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.125rem",
              fontWeight: 700,
              color: "var(--fg-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            Rs. {product.price.toLocaleString()}
          </div>

          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "1.5px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--fg-muted)",
              transition: "border-color 0.2s, color 0.2s, background 0.2s",
              fontSize: "0.9rem",
            }}
          >
            →
          </div>
        </div>
      </div>
    </Link>
  );
}
