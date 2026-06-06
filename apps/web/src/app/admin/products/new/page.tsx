"use client";

import Link from "next/link";
import { ProductForm } from "@/features/admin-products/components/product-form";

export default function CreateProductPage() {
  return (
    <div style={{ padding: "2.5rem 2rem", maxWidth: 1200 }}>
      {/* Breadcrumb + header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.875rem" }}>
          <Link
            href="/admin/products"
            style={{
              fontSize: "0.8rem",
              color: "var(--fg-muted)",
              textDecoration: "none",
              transition: "color 0.15s ease",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--fg-secondary)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--fg-muted)")}
          >
            Products
          </Link>
          <span style={{ color: "var(--fg-muted)", fontSize: "0.8rem" }}>›</span>
          <span style={{ fontSize: "0.8rem", color: "var(--fg-secondary)" }}>New Product</span>
        </div>
        <div className="section-label" style={{ marginBottom: "0.75rem" }}>Catalog</div>
        <h1
          className="font-display"
          style={{
            fontSize: "clamp(1.5rem, 3vw, 2rem)",
            fontWeight: 700,
            color: "var(--fg-primary)",
            letterSpacing: "-0.025em",
          }}
        >
          Add New Product
        </h1>
        <p style={{ marginTop: "0.375rem", fontSize: "0.875rem", color: "var(--fg-secondary)" }}>
          Fill in the details below to add a new product to your catalog.
        </p>
      </div>

      <ProductForm />
    </div>
  );
}
