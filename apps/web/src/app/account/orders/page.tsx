"use client";

import { useAuthGuard } from "@/features/auth/hooks/use-auth-session";
import { useOrderHistory } from "@/features/orders/hooks/use-orders";
import { MainLayout } from "@/components/layout/main-layout";
import Link from "next/link";
import { Package } from "lucide-react";

export default function OrdersHistoryPage() {
  // 1. Authenticate user
  const { isAuthenticated, isHydrated } = useAuthGuard();
  
  // 2. Fetch user order history
  const { data: orders, isLoading, isError } = useOrderHistory();

  if (!isHydrated || isLoading) {
    return (
      <MainLayout>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", background: "var(--bg-base)" }}>
          <div style={{ fontSize: "1.1rem", color: "var(--fg-secondary)" }}>Loading order history...</div>
        </div>
      </MainLayout>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <MainLayout>
      <div style={{ background: "var(--bg-base)", height: "calc(100vh - 140px)", display: "flex", flexDirection: "column", padding: "2rem 1.5rem" }}>
        <div style={{ maxWidth: "1024px", margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", height: "100%" }}>
          
          {/* Header */}
          <div style={{ marginBottom: "1.5rem", flexShrink: 0 }}>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 700, color: "var(--fg-primary)", marginBottom: "0.5rem" }}>My Orders</h1>
            <p style={{ color: "var(--fg-muted)", fontSize: "0.9rem" }}>View and manage your current and previous furniture orders.</p>
          </div>
          
          <div style={{ flex: 1, overflowY: "auto", paddingRight: "0.5rem", paddingBottom: "2rem" }}>

          {isError && (
            <div style={{ padding: "1.5rem", background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "var(--radius-md)", color: "#b91c1c", marginBottom: "2rem" }}>
              Unable to load order history. Please try again.
            </div>
          )}

          {!orders || orders.length === 0 ? (
            <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "4rem 2rem", textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", color: "var(--fg-muted)", marginBottom: "1.5rem" }}>
                <Package size={48} strokeWidth={1.2} />
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--fg-primary)", marginBottom: "0.5rem" }}>No Orders Placed Yet</h3>
              <p style={{ color: "var(--fg-secondary)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>You haven&apos;t ordered any luxury furniture items yet.</p>
              <Link href="/products" style={{ background: "var(--accent-dark)", color: "white", padding: "0.6rem 1.25rem", borderRadius: "var(--radius-md)", textDecoration: "none", fontWeight: 600, fontSize: "0.9rem" }}>
                Browse Furniture
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {orders.map((order) => {
                const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                });

                return (
                  <div
                    key={order.orderId}
                    style={{
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-lg)",
                      padding: "1.5rem",
                      boxShadow: "var(--shadow-sm)",
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "1.5rem",
                      transition: "border-color 0.2s"
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                        <span style={{ fontWeight: 700, color: "var(--fg-primary)", fontSize: "1rem" }}>Order #{order.orderId}</span>
                        <span style={{ fontSize: "0.85rem", color: "var(--fg-muted)" }}>| {formattedDate}</span>
                      </div>

                      {/* Snippet details */}
                      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", fontSize: "0.9rem", color: "var(--fg-secondary)", marginTop: "0.25rem" }}>
                        <div>
                          <span>Payment Method: </span>
                          <strong style={{ color: "var(--fg-primary)" }}>{order.paymentMethod}</strong>
                        </div>
                        <div>
                          <span>Total Amount: </span>
                          <strong className="font-numeric" style={{ color: "var(--fg-primary)" }}>Rs. {order.totalAmount.toLocaleString()}</strong>
                        </div>
                      </div>

                      {/* Product Images Preview */}
                      <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem", overflowX: "auto", paddingBottom: "0.25rem" }}>
                        {order.items?.slice(0, 4).map((item, idx) => (
                          <div key={idx} style={{ position: "relative", width: "48px", height: "48px", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border)", flexShrink: 0 }} title={item.product.name}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.product.images?.[0] || "/placeholder.jpg"} alt={item.product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          </div>
                        ))}
                        {order.items && order.items.length > 4 && (
                          <div style={{ width: "48px", height: "48px", borderRadius: "8px", background: "var(--bg-elevated)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 600, color: "var(--fg-secondary)", flexShrink: 0 }}>
                            +{order.items.length - 4}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status badges and actions */}
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                      {/* Payment Status badge */}
                      <span
                        style={{
                          fontWeight: 600,
                          color:
                            order.paymentStatus === "PAID"
                              ? "#166534"
                              : order.paymentStatus === "FAILED"
                              ? "#991b1b"
                              : "#854d0e",
                          background:
                            order.paymentStatus === "PAID"
                              ? "rgba(34, 197, 94, 0.12)"
                              : order.paymentStatus === "FAILED"
                              ? "rgba(239, 68, 68, 0.12)"
                              : "rgba(201, 169, 110, 0.12)",
                          padding: "0.2rem 0.625rem",
                          borderRadius: "var(--radius-full)",
                          fontSize: "0.8rem",
                        }}
                      >
                        {order.paymentStatus}
                      </span>

                      {/* Order Status badge */}
                      <span
                        style={{
                          fontWeight: 600,
                          color:
                            order.orderStatus === "DELIVERED"
                              ? "#166534"
                              : order.orderStatus === "CANCELLED"
                              ? "#991b1b"
                              : "#1e3a8a",
                          background:
                            order.orderStatus === "DELIVERED"
                              ? "rgba(34, 197, 94, 0.12)"
                              : order.orderStatus === "CANCELLED"
                              ? "rgba(239, 68, 68, 0.12)"
                              : "rgba(30, 58, 138, 0.12)",
                          padding: "0.2rem 0.625rem",
                          borderRadius: "var(--radius-full)",
                          fontSize: "0.8rem",
                        }}
                      >
                        {order.orderStatus}
                      </span>

                      {/* Action trigger */}
                      <Link
                        href={`/account/orders/${order.orderId}`}
                        style={{
                          padding: "0.5rem 1rem",
                          border: "1.5px solid var(--border)",
                          borderRadius: "var(--radius-md)",
                          color: "var(--fg-secondary)",
                          textDecoration: "none",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          transition: "border-color 0.2s, background 0.2s"
                        }}
                      >
                        View Details
                      </Link>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

          </div>
        </div>
      </div>
    </MainLayout>
  );
}
