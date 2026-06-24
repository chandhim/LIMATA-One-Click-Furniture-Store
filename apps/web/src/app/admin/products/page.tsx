"use client";

import Link from "next/link";
import { ProductTable } from "@/features/admin-products/components/product-table";

export default function AdminProductsPage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 64px)",
        padding: "1.5rem 2rem",
        maxWidth: 1400,
        margin: "0 auto",
        background: "var(--bg-base)",
        overflow: "hidden",
      }}
    >
      {/* Page header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: "1rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
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
