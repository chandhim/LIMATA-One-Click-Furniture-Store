"use client";

import { useState } from "react";
import { useAdminOrders, useUpdateOrderStatus } from "@/features/admin/hooks/use-admin";
import { Search, CreditCard } from "lucide-react";

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "CANCELLATION_REQUESTED";

const statusColors: Record<OrderStatus, { bg: string; color: string; border: string }> = {
  PENDING: { bg: "rgba(220,160,80,0.08)", color: "#a85f10", border: "rgba(220,160,80,0.18)" },
  CONFIRMED: { bg: "rgba(100,130,220,0.08)", color: "#2a4a9a", border: "rgba(100,130,220,0.18)" },
  PROCESSING: { bg: "rgba(100,130,220,0.15)", color: "#1a3a7a", border: "rgba(100,130,220,0.25)" },
  SHIPPED: { bg: "rgba(160,100,220,0.08)", color: "#6a2a9a", border: "rgba(160,100,220,0.18)" },
  DELIVERED: { bg: "rgba(74,166,120,0.08)", color: "#276e47", border: "rgba(74,166,120,0.18)" },
  CANCELLED: { bg: "rgba(220,80,80,0.06)", color: "#c0392b", border: "rgba(220,80,80,0.15)" },
  CANCELLATION_REQUESTED: { bg: "rgba(220,80,80,0.12)", color: "#902015", border: "rgba(220,80,80,0.25)" },
};

interface AdminOrderItem {
  id: string;
  quantity: number;
  product?: {
    name: string;
  };
}

interface AdminOrder {
  id: string;
  shippingName: string;
  shippingEmail: string;
  shippingPhone?: string;
  createdAt: string;
  items?: AdminOrderItem[];
  paymentMethod: string;
  paymentStatus: string;
  totalAmount: number;
  orderStatus: OrderStatus;
}

export default function AdminOrdersPage() {
  const { data: orders = [], isLoading } = useAdminOrders();
  const updateStatusMutation = useUpdateOrderStatus();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  async function handleStatusChange(id: string, status: string) {
    try {
      await updateStatusMutation.mutateAsync({ id, status });
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  }

  // Filter orders
  const filteredOrders = orders.filter((o: AdminOrder) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.shippingName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.shippingEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || o.orderStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const orderStatusesList: OrderStatus[] = [
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "CANCELLATION_REQUESTED",
  ];

  if (isLoading) {
    return (
      <div 
        style={{ 
          padding: "4rem", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          minHeight: "80vh", 
          color: "var(--fg-muted)", 
          gap: "0.75rem",
          background: "var(--bg-base)"
        }}
      >
        <div style={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid var(--accent)", borderTopColor: "transparent", animation: "spin 0.7s linear infinite" }} />
        <span>Loading orders...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: "2.5rem 2rem", maxWidth: 1400, margin: "0 auto", background: "var(--bg-base)", minHeight: "100vh" }}>
      
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div className="section-label" style={{ marginBottom: "0.75rem" }}>Sales</div>
        <h1 className="font-display" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "var(--fg-primary)", letterSpacing: "-0.025em" }}>
          Order Management
        </h1>
        <p style={{ marginTop: "0.375rem", fontSize: "0.875rem", color: "var(--fg-secondary)" }}>
          Track, filter and update user order shipments.
        </p>
      </div>

      {/* Filters row */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "2rem" }}>
        
        {/* Search bar */}
        <div style={{ position: "relative", maxWidth: 500, width: "100%" }}>
          <Search 
            size={16} 
            style={{ 
              position: "absolute", 
              left: "1rem", 
              top: "50%", 
              transform: "translateY(-50%)", 
              color: "var(--fg-muted)" 
            }} 
          />
          <input
            type="text"
            placeholder="Search by Order ID, Customer Name or Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-base"
            style={{ 
              paddingLeft: "2.75rem", 
              fontSize: "0.875rem" 
            }}
          />
        </div>

        {/* Status Tab Pills */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
          <button
            onClick={() => setStatusFilter("ALL")}
            style={{
              padding: "0.5rem 1.125rem",
              background: statusFilter === "ALL" ? "var(--bg-dark)" : "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-full)",
              fontSize: "0.75rem",
              fontWeight: 600,
              color: statusFilter === "ALL" ? "#fff" : "var(--fg-secondary)",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: statusFilter === "ALL" ? "var(--shadow-sm)" : "none",
            }}
            onMouseEnter={(e) => {
              if (statusFilter !== "ALL") {
                e.currentTarget.style.background = "var(--bg-elevated)";
                e.currentTarget.style.color = "var(--fg-primary)";
              }
            }}
            onMouseLeave={(e) => {
              if (statusFilter !== "ALL") {
                e.currentTarget.style.background = "var(--bg-surface)";
                e.currentTarget.style.color = "var(--fg-secondary)";
              }
            }}
          >
            All ({orders.length})
          </button>
          
          {orderStatusesList.map((status) => {
            const count = orders.filter((o: AdminOrder) => o.orderStatus === status).length;
            const active = statusFilter === status;
            const colors = statusColors[status];
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                style={{
                  padding: "0.5rem 1.125rem",
                  background: active ? colors.bg : "var(--bg-surface)",
                  border: `1px solid ${active ? colors.color : "var(--border)"}`,
                  borderRadius: "var(--radius-full)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: active ? colors.color : "var(--fg-muted)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: active ? "0 2px 8px rgba(0,0,0,0.03)" : "none",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.borderColor = colors.color;
                    e.currentTarget.style.color = colors.color;
                    e.currentTarget.style.background = colors.bg;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.color = "var(--fg-muted)";
                    e.currentTarget.style.background = "var(--bg-surface)";
                  }
                }}
              >
                {status.charAt(0) + status.slice(1).toLowerCase().replace("_", " ")} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table Container */}
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
              <tr style={{ background: "var(--bg-elevated)", borderBottom: "1px solid var(--border)" }}>
                {["Order ID", "Customer Details", "Date Purchased", "Items Detail", "Payment Mode", "Grand Total", "Status Badge", "Actions Status"].map((h) => (
                  <th key={h} style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg-secondary)", whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: "5rem", textAlign: "center", color: "var(--fg-muted)", fontSize: "0.875rem" }}>
                    No matching orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order: AdminOrder, idx: number) => {
                  const colors = statusColors[order.orderStatus] || { bg: "rgba(0,0,0,0.05)", color: "var(--fg-muted)", border: "transparent" };
                  const nameInitials = order.shippingName?.[0]?.toUpperCase() ?? "C";
                  
                  return (
                    <tr
                      key={order.id}
                      style={{ borderBottom: idx < filteredOrders.length - 1 ? "1px solid var(--border)" : "none", transition: "background 0.2s ease" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(250,249,247,0.4)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                    >
                      {/* ID */}
                      <td style={{ padding: "1.25rem 1.5rem", fontSize: "0.825rem", fontWeight: 700, color: "var(--fg-primary)", fontFamily: "monospace" }}>
                        {order.id}
                      </td>

                      {/* Customer Details */}
                      <td style={{ padding: "1.25rem 1.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                              background: "var(--bg-elevated)",
                              border: "1px solid var(--border)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "0.8rem",
                              fontWeight: 700,
                              color: "var(--accent-dark)",
                              flexShrink: 0
                            }}
                          >
                            {nameInitials}
                          </div>
                          <div>
                            <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--fg-primary)" }}>{order.shippingName}</div>
                            <div style={{ fontSize: "0.75rem", color: "var(--fg-muted)", marginTop: "0.125rem" }}>{order.shippingEmail}</div>
                            {order.shippingPhone && (
                              <div style={{ fontSize: "0.7rem", color: "var(--fg-muted)", fontStyle: "italic", marginTop: "0.05rem" }}>{order.shippingPhone}</div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td style={{ padding: "1.25rem 1.5rem", fontSize: "0.825rem", color: "var(--fg-secondary)", whiteSpace: "nowrap" }}>
                        {new Date(order.createdAt).toLocaleDateString([], { year: "numeric", month: "short", day: "numeric" })}
                      </td>

                      {/* Items Details */}
                      <td style={{ padding: "1.25rem 1.5rem", fontSize: "0.825rem", color: "var(--fg-secondary)", minWidth: 200 }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                          {order.items?.map((item: AdminOrderItem) => (
                            <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.8rem" }}>
                              <span style={{ color: "var(--fg-primary)", fontWeight: 500 }}>{item.product?.name}</span>
                              <span style={{ color: "var(--fg-muted)", fontSize: "0.75rem" }}>x{item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Payment Mode */}
                      <td style={{ padding: "1.25rem 1.5rem" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.8rem", fontWeight: 600, color: "var(--fg-primary)" }}>
                            <CreditCard size={13} style={{ color: "var(--fg-muted)" }} />
                            <span>{order.paymentMethod}</span>
                          </div>
                          <div>
                            <span
                              style={{
                                fontSize: "0.68rem",
                                fontWeight: 700,
                                padding: "0.15rem 0.45rem",
                                borderRadius: "4px",
                                background: order.paymentStatus === "PAID" ? "rgba(74,166,120,0.12)" : "rgba(220,80,80,0.08)",
                                color: order.paymentStatus === "PAID" ? "#276e47" : "#c0392b",
                              }}
                            >
                              {order.paymentStatus}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Total */}
                      <td style={{ padding: "1.25rem 1.5rem", fontSize: "0.9375rem", fontWeight: 700, color: "var(--fg-primary)" }}>
                        Rs. {order.totalAmount?.toLocaleString()}
                      </td>

                      {/* Status Badge */}
                      <td style={{ padding: "1.25rem 1.5rem" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            padding: "0.25rem 0.625rem",
                            borderRadius: "var(--radius-full)",
                            background: colors.bg,
                            color: colors.color,
                            border: `1px solid ${colors.border}`,
                          }}
                        >
                          {order.orderStatus.charAt(0) + order.orderStatus.slice(1).toLowerCase().replace("_", " ")}
                        </span>
                      </td>

                      {/* Select Action Dropdown */}
                      <td style={{ padding: "1.25rem 1.5rem" }}>
                        <div style={{ position: "relative", display: "inline-block" }}>
                          <select
                            value={order.orderStatus}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="input-base"
                            style={{ 
                              padding: "0.4rem 1.75rem 0.4rem 0.75rem", 
                              fontSize: "0.75rem", 
                              fontWeight: 600,
                              minWidth: 140,
                              borderRadius: "var(--radius-md)",
                              background: "var(--bg-surface)",
                              cursor: "pointer",
                              border: "1px solid var(--border)",
                            }}
                          >
                            <option value="PENDING">Pending</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="PROCESSING">Processing</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                            <option value="CANCELLATION_REQUESTED">Cancel Requested</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
