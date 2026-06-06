"use client";

import Link from "next/link";
import { useAdminProducts } from "@/features/admin-products/hooks/use-admin-products";
import { useDeleteProduct } from "@/features/admin-products/hooks/use-delete-product";

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
        Loading products...
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div
        style={{
          padding: "4rem",
          textAlign: "center",
          color: "var(--fg-muted)",
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
        }}
      >
        <div style={{ fontSize: "2.5rem", marginBottom: "1rem", opacity: 0.4 }}>📦</div>
        <p style={{ fontWeight: 500, color: "var(--fg-secondary)", marginBottom: "1rem" }}>
          No products yet
        </p>
        <Link
          href="/admin/products/new"
          className="btn-shimmer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.625rem 1.5rem",
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "var(--fg-primary)",
            textDecoration: "none",
            borderRadius: "var(--radius-full)",
          }}
        >
          Add your first product
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
              {["Image", "Name", "Category", "Price", "Stock", "Actions"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "0.875rem 1.25rem",
                    textAlign: "left",
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--fg-muted)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((product: any, i: number) => (
              <tr
                key={product.id}
                style={{
                  borderBottom:
                    i < products.length - 1 ? "1px solid var(--border)" : "none",
                  transition: "background 0.15s ease",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.background =
                    "var(--bg-elevated)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = "transparent")
                }
              >
                {/* Image */}
                <td style={{ padding: "1rem 1.25rem" }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "var(--radius-sm)",
                      background: "var(--bg-elevated)",
                      border: "1px solid var(--border)",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.25rem",
                    }}
                  >
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      "📦"
                    )}
                  </div>
                </td>

                {/* Name */}
                <td style={{ padding: "1rem 1.25rem" }}>
                  <div
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 500,
                      color: "var(--fg-primary)",
                      marginBottom: "0.2rem",
                    }}
                  >
                    {product.name}
                  </div>
                  {product.material && (
                    <div style={{ fontSize: "0.75rem", color: "var(--fg-muted)" }}>
                      {product.material}
                    </div>
                  )}
                </td>

                {/* Category */}
                <td style={{ padding: "1rem 1.25rem" }}>
                  <span
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 500,
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

                {/* Price */}
                <td style={{ padding: "1rem 1.25rem" }}>
                  <span
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "var(--fg-primary)",
                    }}
                  >
                    Rs. {product.price?.toLocaleString()}
                  </span>
                </td>

                {/* Stock */}
                <td style={{ padding: "1rem 1.25rem" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      padding: "0.25rem 0.625rem",
                      borderRadius: "var(--radius-full)",
                      background:
                        product.stock > 5
                          ? "rgba(100,180,140,0.12)"
                          : product.stock > 0
                          ? "rgba(220,160,80,0.12)"
                          : "rgba(220,80,80,0.1)",
                      color:
                        product.stock > 5
                          ? "#3a7a50"
                          : product.stock > 0
                          ? "#8a5f10"
                          : "#c0392b",
                    }}
                  >
                    {product.stock}
                  </span>
                </td>

                {/* Actions */}
                <td style={{ padding: "1rem 1.25rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: 500,
                        color: "var(--accent-dark)",
                        textDecoration: "none",
                        padding: "0.375rem 0.875rem",
                        border: "1px solid var(--accent-light)",
                        borderRadius: "var(--radius-full)",
                        transition: "all 0.15s ease",
                        whiteSpace: "nowrap",
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.background = "rgba(201,169,110,0.08)";
                        el.style.borderColor = "var(--accent)";
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.background = "transparent";
                        el.style.borderColor = "var(--accent-light)";
                      }}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm("Delete this product? This cannot be undone.")) {
                          deleteProduct.mutate(product.id);
                        }
                      }}
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: 500,
                        color: "var(--fg-muted)",
                        background: "transparent",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-full)",
                        padding: "0.375rem 0.875rem",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                        whiteSpace: "nowrap",
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.borderColor = "rgba(220,80,80,0.4)";
                        el.style.color = "#c0392b";
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.borderColor = "var(--border)";
                        el.style.color = "var(--fg-muted)";
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
