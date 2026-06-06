"use client";

import Link from "next/link";
import { ProductTable } from "@/features/admin-products/components/product-table";

export default function AdminProductsPage() {
  return (
    <div style={{ padding: "2.5rem 2rem", maxWidth: 1200 }}>
      {/* Page header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: "2rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <div className="section-label" style={{ marginBottom: "0.75rem" }}>
            Catalog
          </div>
          <h1
            className="font-display"
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              fontWeight: 700,
              color: "var(--fg-primary)",
              letterSpacing: "-0.025em",
              lineHeight: 1.2,
            }}
          >
            Product Management
          </h1>
          <p
            style={{
              marginTop: "0.375rem",
              fontSize: "0.875rem",
              color: "var(--fg-secondary)",
            }}
          >
            Create, edit and manage your product catalog.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="btn-shimmer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 1.5rem",
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "var(--fg-primary)",
            textDecoration: "none",
            borderRadius: "var(--radius-full)",
          }}
        >
          <span style={{ fontSize: "1rem", lineHeight: 1 }}>＋</span>
          Add Product
        </Link>
      </div>

      <ProductTable />
    </div>
  );
}
