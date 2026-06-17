"use client";

import Link from "next/link";
import Image from "next/image";
import { useAdminProducts } from "@/features/admin-products/hooks/use-admin-products";
import { useDeleteProduct } from "@/features/admin-products/hooks/use-delete-product";
import type { Product } from "@/features/products/types/product.types";
import { Edit3, Trash2, Plus } from "lucide-react";

export function ProductTable() {
  const { data: products, isLoading } = useAdminProducts();
  const deleteProduct = useDeleteProduct();

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "4rem",
          color: "var(--fg-muted)",
          fontSize: "0.875rem",
          gap: "0.75rem",
          background: "var(--bg-base)"
        }}
      >
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            border: "2px solid var(--accent)",
            borderTopColor: "transparent",
            animation: "spin 0.7s linear infinite",
          }}
        />
        <span>Loading product list...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div
        style={{
          padding: "5rem 2rem",
          textAlign: "center",
          color: "var(--fg-muted)",
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-sm)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.25rem"
        }}
      >
        <div 
          style={{ 
            width: 56, 
            height: 56, 
            borderRadius: "50%", 
            background: "var(--bg-elevated)", 
            border: "1px solid var(--border)",
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            fontSize: "1.5rem" 
          }}
        >
          📦
        </div>
        <div>
          <p style={{ fontWeight: 700, color: "var(--fg-primary)", fontSize: "1rem", margin: "0 0 0.25rem" }}>
            No products listed yet
          </p>
          <p style={{ fontSize: "0.8rem", color: "var(--fg-muted)", margin: 0 }}>
            Get started by populating your design catalog.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="btn-shimmer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.375rem",
            padding: "0.75rem 1.75rem",
            fontSize: "0.875rem",
            fontWeight: 700,
            color: "var(--fg-primary)",
            textDecoration: "none",
            borderRadius: "var(--radius-full)",
            boxShadow: "var(--shadow-accent)"
          }}
        >
          <Plus size={14} />
          <span>Add Product</span>
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        boxShadow: "var(--shadow-sm)"
      }}
    >
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr
              style={{
                background: "var(--bg-elevated)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              {["Preview", "Design Name", "Room Category", "Retail Price", "Inventory", "Actions"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "1rem 1.5rem",
                    textAlign: "left",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--fg-secondary)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((product: Product, idx: number) => {
              const isHighStock = product.stock > 5;
              const isLowStock = product.stock > 0 && product.stock <= 5;
              
              return (
                <tr
                  key={product.id}
                  style={{
                    borderBottom: idx < products.length - 1 ? "1px solid var(--border)" : "none",
                    transition: "background 0.2s ease",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background =
                      "rgba(250,249,247,0.4)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = "transparent")
                  }
                >
                  {/* Image Preview */}
                  <td style={{ padding: "1.125rem 1.5rem" }}>
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: "var(--radius-md)",
                        background: "var(--bg-elevated)",
                        border: "1px solid var(--border)",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.25rem",
                        position: "relative",
                        boxShadow: "var(--shadow-sm)"
                      }}
                    >
                      {product.images?.[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          unoptimized
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        "📦"
                      )}
                    </div>
                  </td>

                  {/* Name details */}
                  <td style={{ padding: "1.125rem 1.5rem" }}>
                    <div
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        color: "var(--fg-primary)",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {product.name}
                    </div>
                    {product.material && (
                      <div style={{ fontSize: "0.75rem", color: "var(--fg-muted)", fontWeight: 500 }}>
                        {product.material}
                      </div>
                    )}
                  </td>

                  {/* Category badging */}
                  <td style={{ padding: "1.125rem 1.5rem" }}>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: "var(--accent-dark)",
                        background: "rgba(201,169,110,0.1)",
                        border: "1px solid rgba(201,169,110,0.2)",
                        borderRadius: "var(--radius-full)",
                        padding: "0.2rem 0.625rem",
                      }}
                    >
                      {product.category}
                    </span>
                  </td>

                  {/* Pricing Details */}
                  <td style={{ padding: "1.125rem 1.5rem" }}>
                    <span
                      style={{
                        fontSize: "0.9375rem",
                        fontWeight: 700,
                        color: "var(--fg-primary)",
                      }}
                    >
                      Rs. {product.price?.toLocaleString()}
                    </span>
                  </td>

                  {/* Inventory indicator */}
                  <td style={{ padding: "1.125rem 1.5rem" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        padding: "0.25rem 0.625rem",
                        borderRadius: "var(--radius-full)",
                        background: isHighStock
                          ? "rgba(74,166,120,0.12)"
                          : isLowStock
                          ? "rgba(220,160,80,0.12)"
                          : "rgba(220,80,80,0.08)",
                        color: isHighStock
                          ? "#276e47"
                          : isLowStock
                          ? "#a85f10"
                          : "#c0392b",
                        border: `1px solid ${isHighStock ? "rgba(74,166,120,0.2)" : isLowStock ? "rgba(220,160,80,0.2)" : "rgba(220,80,80,0.15)"}`
                      }}
                    >
                      {product.stock === 0 ? "Out of Stock" : isLowStock ? `${product.stock} Left (Low)` : `${product.stock} In Stock`}
                    </span>
                  </td>

                  {/* Action triggers */}
                  <td style={{ padding: "1.125rem 1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        style={{
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          color: "var(--accent-dark)",
                          textDecoration: "none",
                          padding: "0.4rem 1rem",
                          border: "1px solid var(--accent-light)",
                          borderRadius: "var(--radius-full)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.25rem",
                          background: "var(--bg-surface)",
                          transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                          whiteSpace: "nowrap",
                        }}
                        onMouseEnter={(e) => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.background = "rgba(201,169,110,0.08)";
                          el.style.borderColor = "var(--accent)";
                        }}
                        onMouseLeave={(e) => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.background = "var(--bg-surface)";
                          el.style.borderColor = "var(--accent-light)";
                        }}
                      >
                        <Edit3 size={12} />
                        <span>Edit</span>
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm("Delete this product? This cannot be undone.")) {
                            deleteProduct.mutate(product.id);
                          }
                        }}
                        style={{
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          color: "var(--fg-muted)",
                          background: "transparent",
                          border: "1px solid var(--border)",
                          borderRadius: "var(--radius-full)",
                          padding: "0.4rem 1rem",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.25rem",
                          transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                          whiteSpace: "nowrap",
                        }}
                        onMouseEnter={(e) => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.borderColor = "rgba(220,80,80,0.25)";
                          el.style.color = "#c0392b";
                          el.style.background = "rgba(220,80,80,0.05)";
                        }}
                        onMouseLeave={(e) => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.borderColor = "var(--border)";
                          el.style.color = "var(--fg-muted)";
                          el.style.background = "transparent";
                        }}
                      >
                        <Trash2 size={12} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
