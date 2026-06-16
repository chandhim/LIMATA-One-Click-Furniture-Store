"use client";

import Link from "next/link";
import { ShoppingCart, ArrowRight } from "lucide-react";

export function CartEmptyState() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "6rem 2rem",
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-xl)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "rgba(201,169,110,0.08)",
          border: "1.5px dashed var(--accent-light)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1.75rem",
          color: "var(--accent-dark)",
        }}
      >
        <ShoppingCart size={32} strokeWidth={1.5} />
      </div>

      {/* Label */}
      <div className="section-label" style={{ marginBottom: "0.75rem" }}>
        Empty Cart
      </div>

      <h2
        className="font-display"
        style={{
          fontSize: "1.625rem",
          fontWeight: 700,
          color: "var(--fg-primary)",
          marginBottom: "0.75rem",
          letterSpacing: "-0.02em",
        }}
      >
        Your Cart Is Empty
      </h2>

      <p
        style={{
          fontSize: "0.9375rem",
          color: "var(--fg-secondary)",
          maxWidth: "22rem",
          lineHeight: 1.6,
          marginBottom: "2.25rem",
        }}
      >
        Looks like you haven&apos;t added any pieces yet. Explore our curated
        furniture collection and find your perfect match.
      </p>

      <Link
        href="/products"
        className="btn-shimmer"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.75rem 2rem",
          fontSize: "0.9375rem",
          fontWeight: 600,
          color: "var(--fg-primary)",
          textDecoration: "none",
          borderRadius: "var(--radius-full)",
          boxShadow: "var(--shadow-accent)",
        }}
      >
        Continue Shopping
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
