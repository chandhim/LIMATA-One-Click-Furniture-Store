"use client";

import Link from "next/link";
import Image from "next/image";
import { useAdminProducts } from "@/features/admin-products/hooks/use-admin-products";
import { useDeleteProduct } from "@/features/admin-products/hooks/use-delete-product";
import type { Product } from "@/features/products/types/product.types";
import { Edit3, Trash2, Plus, Search, Package } from "lucide-react";

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
          background: "var(--bg-base)",
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
          gap: "1.25rem",
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
            color: "var(--fg-muted)",
          }}
        >
          <Package size={28} strokeWidth={1.2} />
        </div>
        <div>
          <p
            style={{
              fontWeight: 700,
              color: "var(--fg-primary)",
              fontSize: "1rem",
              margin: "0 0 0.25rem",
            }}
          >
            No products listed yet
          </p>
          <p
            style={{ fontSize: "0.8rem", color: "var(--fg-muted)", margin: 0 }}
          >
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
            boxShadow: "var(--shadow-accent)",
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
        boxShadow: "var(--shadow-sm)",
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
      }}
    >
      {/* Search & Filter Toolbar */}
      <div
        style={{
          padding: "1rem 1.5rem",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            position: "relative",
            flex: 1,
            minWidth: "200px",
            maxWidth: "320px",
          }}
        >
          <input
            type="text"
            placeholder="Search products by name or SKU..."
            style={{
              width: "100%",
              padding: "0.5rem 1rem 0.5rem 2.25rem",
              fontSize: "0.85rem",
              background: "var(--bg-base)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              color: "var(--fg-primary)",
              outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />
          <Search
            size={14}
            style={{
              position: "absolute",
              left: "0.75rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--fg-muted)",
            }}
          />
        </div>
        <select
          style={{
            padding: "0.5rem 2rem 0.5rem 1rem",
            fontSize: "0.85rem",
            background: "var(--bg-base)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            color: "var(--fg-primary)",
            outline: "none",
            cursor: "pointer",
            appearance: "none",
            backgroundImage:
              'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 0.7rem top 50%",
            backgroundSize: "0.65rem auto",
          }}
        >
          <option value="all">All Categories</option>
          <option value="living">Living Room</option>
          <option value="bedroom">Bedroom</option>
          <option value="dining">Dining Room</option>
          <option value="office">Office</option>
        </select>
        <select
          style={{
            padding: "0.5rem 2rem 0.5rem 1rem",
            fontSize: "0.85rem",
            background: "var(--bg-base)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            color: "var(--fg-primary)",
            outline: "none",
            cursor: "pointer",
            appearance: "none",
            backgroundImage:
              'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 0.7rem top 50%",
            backgroundSize: "0.65rem auto",
          }}
        >
          <option value="all">Stock Status</option>
          <option value="in-stock">In Stock</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </select>
      </div>

      <div style={{ overflow: "auto", flex: 1 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead
            style={{
              position: "sticky",
              top: 0,
              zIndex: 10,
              background: "var(--bg-elevated)",
              boxShadow: "0 1px 0 var(--border)",
            }}
          >
            <tr>
              {[
                "Preview",
                "Design Name",
                "Room Category",
                "Retail Price",
                "Inventory",
                "Actions",
              ].map((h) => (
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
                  key={product.productId}
                  style={{
                    borderBottom:
                      idx < products.length - 1
                        ? "1px solid var(--border)"
                        : "none",
                    transition: "background 0.2s ease",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background =
                      "rgba(250,249,247,0.4)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background =
                      "transparent")
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
                        boxShadow: "var(--shadow-sm)",
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
                        <Package
                          size={24}
                          strokeWidth={1.2}
                          style={{ color: "var(--fg-muted)" }}
                        />
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
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--fg-muted)",
                          fontWeight: 500,
                        }}
                      >
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
                        border: `1px solid ${isHighStock ? "rgba(74,166,120,0.2)" : isLowStock ? "rgba(220,160,80,0.2)" : "rgba(220,80,80,0.15)"}`,
                      }}
                    >
                      {product.stock === 0
                        ? "Out of Stock"
                        : isLowStock
                          ? `${product.stock} Left (Low)`
                          : `${product.stock} In Stock`}
                    </span>
                  </td>

                  {/* Action triggers */}
                  <td style={{ padding: "1.125rem 1.5rem" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <Link
                        href={`/admin/products/${product.productId}/edit`}
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
                          if (
                            confirm(
                              "Delete this product? This cannot be undone.",
                            )
                          ) {
                            deleteProduct.mutate(product.productId);
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
