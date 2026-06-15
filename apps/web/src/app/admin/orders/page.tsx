"use client";

import { useState } from "react";

type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "COMPLETED";

const statusColors: Record<OrderStatus, { bg: string; color: string }> = {
  PENDING: { bg: "rgba(220,160,80,0.12)", color: "#8a5f10" },
  PROCESSING: { bg: "rgba(100,130,220,0.12)", color: "#2a4a9a" },
  SHIPPED: { bg: "rgba(100,180,140,0.12)", color: "#1a6a40" },
  COMPLETED: { bg: "rgba(100,180,140,0.2)", color: "#0a5a30" },
};

const sampleOrders = [
  { id: "ORD-001", customer: "Arjun Mehta", email: "arjun@email.com", date: "2025-06-05", total: 85000, status: "PENDING" as OrderStatus, items: 3 },
  { id: "ORD-002", customer: "Priya Sharma", email: "priya@email.com", date: "2025-06-04", total: 45000, status: "PROCESSING" as OrderStatus, items: 1 },
  { id: "ORD-003", customer: "Rohan Patel", email: "rohan@email.com", date: "2025-06-03", total: 120000, status: "SHIPPED" as OrderStatus, items: 5 },
  { id: "ORD-004", customer: "Sneha Kumar", email: "sneha@email.com", date: "2025-06-02", total: 32000, status: "COMPLETED" as OrderStatus, items: 2 },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(sampleOrders);

  function updateStatus(id: string, status: OrderStatus) {
    setOrders(orders.map((o) => (o.id === id ? { ...o, status } : o)));
  }

  return (
    <div style={{ padding: "2.5rem 2rem", maxWidth: 1200 }}>
      <div style={{ marginBottom: "2rem" }}>
        <div className="section-label" style={{ marginBottom: "0.75rem" }}>Sales</div>
        <h1 className="font-display" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "var(--fg-primary)", letterSpacing: "-0.025em" }}>
          Order Management
        </h1>
        <p style={{ marginTop: "0.375rem", fontSize: "0.875rem", color: "var(--fg-secondary)" }}>
          Track and update the status of customer orders.
        </p>
      </div>

      {/* Status summary */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {(["PENDING", "PROCESSING", "SHIPPED", "COMPLETED"] as OrderStatus[]).map((status) => {
          const count = orders.filter((o) => o.status === status).length;
          return (
            <div
              key={status}
              style={{
                padding: "0.5rem 1rem",
                background: statusColors[status].bg,
                borderRadius: "var(--radius-full)",
                fontSize: "0.78rem",
                fontWeight: 600,
                color: statusColors[status].color,
              }}
            >
              {count} {status.charAt(0) + status.slice(1).toLowerCase()}
            </div>
          );
        })}
      </div>

      <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--bg-elevated)", borderBottom: "1px solid var(--border)" }}>
                {["Order", "Customer", "Date", "Items", "Total", "Status", "Action"].map((h) => (
                  <th key={h} style={{ padding: "0.875rem 1.25rem", textAlign: "left", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg-muted)", whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <tr
                  key={order.id}
                  style={{ borderBottom: i < orders.length - 1 ? "1px solid var(--border)" : "none", transition: "background 0.15s ease" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--bg-elevated)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                >
                  <td style={{ padding: "1rem 1.25rem", fontSize: "0.85rem", fontWeight: 600, color: "var(--fg-primary)", fontFamily: "monospace" }}>{order.id}</td>
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <div style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--fg-primary)" }}>{order.customer}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--fg-muted)" }}>{order.email}</div>
                  </td>
                  <td style={{ padding: "1rem 1.25rem", fontSize: "0.85rem", color: "var(--fg-secondary)", whiteSpace: "nowrap" }}>{order.date}</td>
                  <td style={{ padding: "1rem 1.25rem", fontSize: "0.85rem", color: "var(--fg-secondary)" }}>{order.items} item{order.items !== 1 ? "s" : ""}</td>
                  <td style={{ padding: "1rem 1.25rem", fontSize: "0.9rem", fontWeight: 600, color: "var(--fg-primary)" }}>Rs. {order.total.toLocaleString()}</td>
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", fontSize: "0.75rem", fontWeight: 600, padding: "0.25rem 0.625rem", borderRadius: "var(--radius-full)", background: statusColors[order.status].bg, color: statusColors[order.status].color }}>
                      {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                      className="input-base"
                      style={{ padding: "0.375rem 0.625rem", fontSize: "0.78rem", minWidth: 130 }}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p style={{ marginTop: "1rem", fontSize: "0.78rem", color: "var(--fg-muted)", fontStyle: "italic" }}>
        Sample data shown. Connect to the orders API to display live orders.
      </p>
    </div>
  );
}
