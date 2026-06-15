"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/features/auth/store/use-auth-store";
import { useAdminProducts } from "@/features/admin-products/hooks/use-admin-products";
import type { Product } from "@/features/products/types/product.types";

const quickActions = [
  {
    icon: "＋",
    title: "Add Product",
    desc: "Create a new product listing",
    href: "/admin/products/new",
    accent: "rgba(201,169,110,0.12)",
    accentBorder: "rgba(201,169,110,0.25)",
  },
  {
    icon: "◻",
    title: "Manage Products",
    desc: "Edit, delete or reorder items",
    href: "/admin/products",
    accent: "rgba(100,180,140,0.1)",
    accentBorder: "rgba(100,180,140,0.2)",
  },
  {
    icon: "⌂",
    title: "Edit Homepage",
    desc: "Update hero, categories & features",
    href: "/admin/homepage",
    accent: "rgba(100,130,220,0.1)",
    accentBorder: "rgba(100,130,220,0.2)",
  },
  {
    icon: "▤",
    title: "Categories",
    desc: "Manage product categories",
    href: "/admin/categories",
    accent: "rgba(220,140,80,0.1)",
    accentBorder: "rgba(220,140,80,0.2)",
  },
  {
    icon: "▭",
    title: "Manage Footer",
    desc: "Links, social & company info",
    href: "/admin/footer",
    accent: "rgba(160,100,220,0.1)",
    accentBorder: "rgba(160,100,220,0.2)",
  },
  {
    icon: "◈",
    title: "View Orders",
    desc: "Track and update order statuses",
    href: "/admin/orders",
    accent: "rgba(220,80,80,0.08)",
    accentBorder: "rgba(220,80,80,0.18)",
  },
];

export default function AdminOverviewPage() {
  const user = useAuthStore((s) => s.user);
  const { data: products } = useAdminProducts();

  const stats = [
    {
      label: "Total Products",
      value: products?.length ?? "—",
      icon: "◻",
      color: "var(--accent)",
    },
    {
      label: "Total Orders",
      value: "—",
      icon: "◈",
      color: "#6eb5a0",
    },
    {
      label: "Pending Orders",
      value: "—",
      icon: "⟳",
      color: "#e8a45a",
    },
    {
      label: "Customers",
      value: "—",
      icon: "◯",
      color: "#8a9ec4",
    },
  ];

  return (
    <div style={{ padding: "2.5rem 2rem", maxWidth: 1200 }}>
      {/* Welcome card */}
      <div
        style={{
          background: "var(--bg-dark)",
          borderRadius: "var(--radius-xl)",
          padding: "2rem 2.5rem",
          marginBottom: "2rem",
          position: "relative",
          overflow: "hidden",
          border: "1px solid rgba(250,249,247,0.06)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-4rem",
            right: "-4rem",
            width: "20rem",
            height: "20rem",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(201,169,110,0.1) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            fontSize: "0.72rem",
            fontWeight: 600,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--accent)",
            marginBottom: "0.625rem",
          }}
        >
          Welcome Back
        </div>
        <h1
          className="font-display"
          style={{
            fontSize: "clamp(1.5rem, 3vw, 2rem)",
            fontWeight: 700,
            color: "#FAF9F7",
            letterSpacing: "-0.025em",
            marginBottom: "0.5rem",
          }}
        >
          {user?.name ?? "Admin"} 👋
        </h1>
        <p style={{ fontSize: "0.9rem", color: "rgba(250,249,247,0.5)", lineHeight: 1.6 }}>
          Manage products, orders and storefront content from here.
        </p>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: "1.5rem",
              transition: "box-shadow 0.2s ease, transform 0.2s ease",
              cursor: "default",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <div
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--fg-muted)",
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "var(--radius-sm)",
                  background: "var(--bg-elevated)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.875rem",
                  color: stat.color,
                }}
              >
                {stat.icon}
              </div>
            </div>
            <div
              className="font-display"
              style={{
                fontSize: "2rem",
                fontWeight: 700,
                color: "var(--fg-primary)",
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: "2rem" }}>
        <div
          className="section-label"
          style={{ marginBottom: "1.25rem" }}
        >
          Quick Actions
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1rem",
          }}
        >
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)",
                  padding: "1.5rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "1rem",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.boxShadow = "var(--shadow-md)";
                  el.style.transform = "translateY(-3px)";
                  el.style.borderColor = "var(--accent-light)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.boxShadow = "none";
                  el.style.transform = "translateY(0)";
                  el.style.borderColor = "var(--border)";
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "var(--radius-md)",
                    background: action.accent,
                    border: `1px solid ${action.accentBorder}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.125rem",
                    color: "var(--fg-primary)",
                    flexShrink: 0,
                  }}
                >
                  {action.icon}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "0.9375rem",
                      fontWeight: 600,
                      color: "var(--fg-primary)",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {action.title}
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--fg-muted)",
                      lineHeight: 1.5,
                    }}
                  >
                    {action.desc}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Products */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.25rem",
          }}
        >
          <div className="section-label">Recent Products</div>
          <Link
            href="/admin/products"
            style={{
              fontSize: "0.8rem",
              color: "var(--accent-dark)",
              textDecoration: "none",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              transition: "gap 0.2s ease",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.gap = "0.625rem")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.gap = "0.375rem")
            }
          >
            View all →
          </Link>
        </div>

        <div
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
          }}
        >
          {!products || products.length === 0 ? (
            <div
              style={{
                padding: "3rem",
                textAlign: "center",
                color: "var(--fg-muted)",
                fontSize: "0.875rem",
              }}
            >
              No products yet.{" "}
              <Link
                href="/admin/products/new"
                style={{ color: "var(--accent-dark)", textDecoration: "none" }}
              >
                Add your first product →
              </Link>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    background: "var(--bg-elevated)",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  {["Product", "Category", "Price", "Stock", ""].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "0.75rem 1.25rem",
                        textAlign: "left",
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--fg-muted)",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 5).map((product: Product, i: number) => (
                  <tr
                    key={product.id}
                    style={{
                      borderBottom:
                        i < Math.min(products.length, 5) - 1
                          ? "1px solid var(--border)"
                          : "none",
                      transition: "background 0.15s ease",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.background =
                        "var(--bg-elevated)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.background =
                        "transparent")
                    }
                  >
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: "var(--radius-sm)",
                            background: "var(--bg-elevated)",
                            border: "1px solid var(--border)",
                            overflow: "hidden",
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.25rem",
                          }}
                        >
                          {product.images?.[0] ? (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              width={40}
                              height={40}
                              unoptimized
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          ) : (
                            "📦"
                          )}
                        </div>
                        <span
                          style={{
                            fontSize: "0.875rem",
                            fontWeight: 500,
                            color: "var(--fg-primary)",
                          }}
                        >
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "1rem 1.25rem", fontSize: "0.85rem", color: "var(--fg-secondary)" }}>
                      {product.category}
                    </td>
                    <td style={{ padding: "1rem 1.25rem", fontSize: "0.85rem", color: "var(--fg-primary)", fontWeight: 600 }}>
                      Rs. {product.price?.toLocaleString()}
                    </td>
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
                        {product.stock} in stock
                      </span>
                    </td>
                    <td style={{ padding: "1rem 1.25rem", textAlign: "right" }}>
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          div[style*="repeat(4, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; }
          div[style*="repeat(3, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          div[style*="repeat(4, 1fr)"] { grid-template-columns: 1fr 1fr !important; }
          div[style*="repeat(3, 1fr)"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}