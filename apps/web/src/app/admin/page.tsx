"use client";

import Link from "next/link";
import { useAuthStore } from "@/features/auth/store/use-auth-store";
import { useAdminStats } from "@/features/admin/hooks/use-admin";
import type { Product } from "@/features/products/types/product.types";
import {
  PlusCircle,
  FolderTree,
  Home,
  Layers,
  FileText,
  ShoppingCart,
  MessageSquare,
  AlertTriangle,
  Bell,
  ArrowUpRight,
  TrendingUp
} from "lucide-react";

interface DashboardRecentOrder {
  orderId: string;
  shippingName: string;
  user?: {
    email: string;
  };
  createdAt: string;
  totalAmount: number;
  orderStatus: string;
}

interface DashboardRecentMessage {
  messageId: string;
  content: string;
  createdAt: string;
  conversation?: {
    customerId: string;
  };
}

interface DashboardRecentActivity {
  notificationId: string;
  title: string;
  message: string;
  createdAt: string;
}

const quickActions = [
  {
    icon: PlusCircle,
    title: "Add Product",
    desc: "Create a new product listing",
    href: "/admin/products/new",
    accent: "rgba(201,169,110,0.08)",
    accentBorder: "rgba(201,169,110,0.2)",
    color: "var(--accent-dark)",
  },
  {
    icon: FolderTree,
    title: "Manage Products",
    desc: "Edit or delete catalog items",
    href: "/admin/products",
    accent: "rgba(100,180,140,0.08)",
    accentBorder: "rgba(100,180,140,0.2)",
    color: "#2a7a50",
  },
  {
    icon: Home,
    title: "Edit Homepage",
    desc: "Update hero & features",
    href: "/admin/homepage",
    accent: "rgba(100,130,220,0.08)",
    accentBorder: "rgba(100,130,220,0.2)",
    color: "#2a4a9a",
  },
  {
    icon: Layers,
    title: "Categories",
    desc: "Manage room collections",
    href: "/admin/categories",
    accent: "rgba(220,140,80,0.08)",
    accentBorder: "rgba(220,140,80,0.2)",
    color: "#a85f10",
  },
  {
    icon: FileText,
    title: "Manage Footer",
    desc: "Links & company socials",
    href: "/admin/footer",
    accent: "rgba(160,100,220,0.08)",
    accentBorder: "rgba(160,100,220,0.2)",
    color: "#6a2a9a",
  },
  {
    icon: ShoppingCart,
    title: "View Orders",
    desc: "Process sales & shipments",
    href: "/admin/orders",
    accent: "rgba(220,80,80,0.08)",
    accentBorder: "rgba(220,80,80,0.18)",
    color: "#c0392b",
  },
];

export default function AdminOverviewPage() {
  const user = useAuthStore((s) => s.user);
  const { data: stats, isLoading } = useAdminStats();

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
        <div 
          style={{ 
            width: 24, 
            height: 24, 
            borderRadius: "50%", 
            border: "2px solid var(--accent)", 
            borderTopColor: "transparent", 
            animation: "spin 0.7s linear infinite" 
          }} 
        />
        <span>Loading Admin Panel...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const statCards = [
    {
      label: "Revenue",
      value: `Rs. ${(stats?.totalRevenue ?? 0).toLocaleString()}`,
      icon: "💰",
      color: "var(--accent)",
    },
    {
      label: "Products",
      value: stats?.totalProducts ?? 0,
      icon: "📦",
      color: "#8a9ec4",
    },
    {
      label: "Total Orders",
      value: stats?.totalOrders ?? 0,
      icon: "🛒",
      color: "#6eb5a0",
    },
    {
      label: "Pending Orders",
      value: stats?.pendingOrders ?? 0,
      icon: "⌛",
      color: "#e8a45a",
    },
    {
      label: "Customers",
      value: stats?.totalCustomers ?? 0,
      icon: "👥",
      color: "#a088c4",
    },
  ];

  return (
    <div style={{ padding: "2.5rem 2rem", maxWidth: 1400, margin: "0 auto", background: "var(--bg-base)", minHeight: "100vh" }}>
      
      {/* Welcome Card Banner */}
      <div
        className="texture-grain animate-fade-up"
        style={{
          background: "radial-gradient(circle at 80% 20%, rgba(201,169,110,0.15), transparent 60%), var(--bg-dark)",
          borderRadius: "var(--radius-xl)",
          padding: "2.25rem 2.75rem",
          marginBottom: "2rem",
          position: "relative",
          overflow: "hidden",
          border: "1px solid rgba(250,249,247,0.06)",
          boxShadow: "var(--shadow-md)",
        }}
      >
        <span 
          style={{ 
            fontSize: "0.7rem", 
            fontWeight: 700, 
            letterSpacing: "0.18em", 
            textTransform: "uppercase", 
            color: "var(--accent)",
            display: "inline-block",
            marginBottom: "0.75rem"
          }}
        >
          Control Panel
        </span>
        <h1
          className="font-serif"
          style={{
            fontSize: "clamp(1.75rem, 3.5vw, 2.25rem)",
            fontWeight: 700,
            color: "#FAF9F7",
            letterSpacing: "-0.01em",
            marginBottom: "0.5rem",
            lineHeight: 1.2,
          }}
        >
          Welcome Back, {user?.name ?? "Admin"}
        </h1>
        <p style={{ fontSize: "0.9rem", color: "rgba(250,249,247,0.5)", lineHeight: 1.6, maxWidth: 650, margin: 0 }}>
          Manage products, orders, chat queries, and storefront content from your control console.
        </p>
      </div>

      {/* Stats Cards Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "1.25rem",
          marginBottom: "2.5rem",
        }}
      >
        {statCards.map((stat, idx) => (
          <div
            key={stat.label}
            className="animate-fade-up"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: "1.5rem",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              boxShadow: "var(--shadow-sm)",
              animationDelay: `${idx * 0.05}s`,
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = "translateY(-4px)";
              el.style.borderColor = "var(--accent-light)";
              el.style.boxShadow = "var(--shadow-md)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = "translateY(0)";
              el.style.borderColor = "var(--border)";
              el.style.boxShadow = "var(--shadow-sm)";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg-secondary)" }}>
                {stat.label}
              </span>
              <div 
                style={{ 
                  width: 32, 
                  height: 32, 
                  borderRadius: "var(--radius-md)", 
                  background: "var(--bg-elevated)", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  fontSize: "1rem",
                  boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)"
                }}
              >
                {stat.icon}
              </div>
            </div>
            <div
              className="font-serif font-numeric text-gradient"
              style={{
                fontSize: "1.75rem",
                fontWeight: 700,
                letterSpacing: "-0.01em",
                lineHeight: 1.1,
              }}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Panel */}
      <div style={{ marginBottom: "2.5rem" }}>
        <div className="section-label" style={{ marginBottom: "1.25rem" }}>Quick Actions</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "1rem" }}>
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} href={action.href} style={{ textDecoration: "none" }}>
                <div
                  className="card"
                  style={{
                    padding: "1.5rem 1.125rem",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    height: "100%",
                  }}
                >
                  <div 
                    style={{ 
                      width: 44, 
                      height: 44, 
                      borderRadius: "50%", 
                      background: action.accent, 
                      border: `1px solid ${action.accentBorder}`, 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center", 
                      color: action.color,
                      marginBottom: "1rem", 
                      flexShrink: 0 
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--fg-primary)", marginBottom: "0.375rem" }}>
                    {action.title}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--fg-muted)", lineHeight: 1.4 }}>
                    {action.desc}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Sections Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "7.5fr 4.5fr", gap: "2rem" }}>
        
        {/* Left Hand Column (Charts & Orders) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          
          {/* Revenue Trends */}
          <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1.75rem", boxShadow: "var(--shadow-sm)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <TrendingUp size={16} style={{ color: "var(--accent)" }} />
                <h3 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--fg-primary)", margin: 0 }}>
                  Revenue Analytics (Last 7 Days)
                </h3>
              </div>
            </div>
            
            {stats?.revenueChart && stats.revenueChart.length > 0 ? (
              <div 
                style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "flex-end", 
                  height: 180, 
                  padding: "0 1.25rem 0.5rem", 
                  borderBottom: "1px solid var(--border)",
                  position: "relative"
                }}
              >
                {/* Horizontal guide lines */}
                <div style={{ position: "absolute", left: 0, right: 0, top: "25%", borderBottom: "1px dashed rgba(28,26,23,0.03)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", left: 0, right: 0, top: "50%", borderBottom: "1px dashed rgba(28,26,23,0.03)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", left: 0, right: 0, top: "75%", borderBottom: "1px dashed rgba(28,26,23,0.03)", pointerEvents: "none" }} />

                {stats.revenueChart.map((c: { date: string; amount: number }) => {
                  const maxAmt = Math.max(...stats.revenueChart.map((x: { amount: number }) => x.amount), 1);
                  const pct = Math.max((c.amount / maxAmt) * 140, 6); // visual scale height in px
                  return (
                    <div key={c.date} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, gap: "0.625rem", zIndex: 1 }}>
                      <div style={{ fontSize: "0.68rem", color: "var(--fg-primary)", fontWeight: 700 }}>
                        {c.amount > 0 ? `Rs. ${c.amount.toLocaleString([], { maximumFractionDigits: 0 })}` : ""}
                      </div>
                      <div
                        style={{
                          width: "35%",
                          height: `${pct}px`,
                          background: "linear-gradient(to top, var(--accent-dark), var(--accent))",
                          borderRadius: "4px 4px 0 0",
                          boxShadow: "0 2px 8px rgba(201,169,110,0.2)",
                          transition: "height 0.4s ease",
                        }}
                      />
                      <div style={{ fontSize: "0.72rem", color: "var(--fg-muted)", fontWeight: 500, marginTop: "0.25rem", whiteSpace: "nowrap" }}>
                        {c.date}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 180, color: "var(--fg-muted)", fontSize: "0.875rem" }}>
                No recent sales record to display.
              </div>
            )}
          </div>

          {/* Recent Orders List */}
          <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
            <div style={{ padding: "1.5rem 1.75rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--fg-primary)", margin: 0 }}>Recent Sales Orders</h3>
              <Link href="/admin/orders" style={{ fontSize: "0.75rem", color: "var(--accent-dark)", textDecoration: "none", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                <span>Manage all orders</span>
                <ArrowUpRight size={13} />
              </Link>
            </div>
            {!stats?.recentOrders || stats.recentOrders.length === 0 ? (
              <div style={{ padding: "4rem", textAlign: "center", color: "var(--fg-muted)", fontSize: "0.875rem" }}>
                No orders placed yet.
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "var(--bg-elevated)", borderBottom: "1px solid var(--border)" }}>
                      {["ID", "Customer Details", "Date", "Grand Total", "Shipment Status"].map((h) => (
                        <th key={h} style={{ padding: "0.875rem 1.75rem", textAlign: "left", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg-secondary)" }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders.map((order: DashboardRecentOrder, idx: number) => {
                      const isDelivered = order.orderStatus === "DELIVERED";
                      const isPending = order.orderStatus === "PENDING";
                      return (
                        <tr
                          key={order.orderId}
                          style={{ borderBottom: idx < stats.recentOrders.length - 1 ? "1px solid var(--border)" : "none", transition: "background 0.2s ease" }}
                          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(250,249,247,0.4)")}
                          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                        >
                          <td style={{ padding: "1.125rem 1.75rem", fontSize: "0.8rem", fontWeight: 700, color: "var(--fg-primary)", fontFamily: "monospace" }}>
                            {order.orderId}
                          </td>
                          <td style={{ padding: "1.125rem 1.75rem" }}>
                            <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--fg-primary)" }}>{order.shippingName}</div>
                            <div style={{ fontSize: "0.72rem", color: "var(--fg-muted)", marginTop: "0.125rem" }}>{order.user?.email}</div>
                          </td>
                          <td style={{ padding: "1.125rem 1.75rem", fontSize: "0.825rem", color: "var(--fg-secondary)" }}>
                            {new Date(order.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                          </td>
                          <td style={{ padding: "1.125rem 1.75rem", fontSize: "0.875rem", color: "var(--fg-primary)", fontWeight: 700 }}>
                            Rs. {order.totalAmount?.toLocaleString()}
                          </td>
                          <td style={{ padding: "1.125rem 1.75rem" }}>
                            <span
                              style={{
                                display: "inline-flex",
                                fontSize: "0.68rem",
                                fontWeight: 700,
                                padding: "0.2rem 0.55rem",
                                borderRadius: "4px",
                                background: isDelivered
                                  ? "rgba(74,166,120,0.12)"
                                  : isPending
                                  ? "rgba(220,160,80,0.12)"
                                  : "rgba(100,130,220,0.12)",
                                color: isDelivered
                                  ? "#276e47"
                                  : isPending
                                  ? "#a85f10"
                                  : "#2a4a9a",
                              }}
                            >
                              {order.orderStatus}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

        {/* Right Hand Column (Feeds & Alerts) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          
          {/* Support Customer Messages */}
          <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
            <div style={{ padding: "1.5rem 1.5rem 1.25rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <MessageSquare size={16} style={{ color: "var(--accent)" }} />
                <h3 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--fg-primary)", margin: 0 }}>Customer Support</h3>
              </div>
              <Link href="/admin/chats" style={{ fontSize: "0.75rem", color: "var(--accent-dark)", textDecoration: "none", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                <span>Inbox</span>
                <ArrowUpRight size={13} />
              </Link>
            </div>
            <div style={{ padding: "0.5rem 1.5rem" }}>
              {!stats?.recentMessages || stats.recentMessages.length === 0 ? (
                <p style={{ fontSize: "0.8rem", color: "var(--fg-muted)", padding: "2rem 0", margin: 0, textAlign: "center" }}>
                  No support messages received.
                </p>
              ) : (
                stats.recentMessages.map((msg: DashboardRecentMessage, index: number) => (
                  <Link key={msg.messageId} href="/admin/chats" style={{ textDecoration: "none" }}>
                    <div
                      style={{
                        padding: "1rem 0",
                        borderBottom: index < stats.recentMessages.length - 1 ? "1px solid var(--border)" : "none",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.375rem",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem" }}>
                        <span style={{ fontWeight: 700, color: "var(--fg-primary)" }}>
                          Customer #{msg.conversation?.customerId.slice(-6).toUpperCase()}
                        </span>
                        <span style={{ color: "var(--fg-muted)" }}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p style={{ fontSize: "0.8rem", color: "var(--fg-secondary)", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {msg.content}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Low Stock Warning Box */}
          <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
            <div style={{ padding: "1.5rem 1.5rem 1.25rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <AlertTriangle size={16} style={{ color: "#e8a45a" }} />
                <h3 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--fg-primary)", margin: 0 }}>Inventory Warnings</h3>
              </div>
              <Link href="/admin/products" style={{ fontSize: "0.75rem", color: "var(--accent-dark)", textDecoration: "none", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                <span>Stock</span>
                <ArrowUpRight size={13} />
              </Link>
            </div>
            <div style={{ padding: "0.5rem 1.5rem" }}>
              {!stats?.lowStockProducts || stats.lowStockProducts.length === 0 ? (
                <p style={{ fontSize: "0.8rem", color: "var(--fg-muted)", padding: "2rem 0", margin: 0, textAlign: "center" }}>
                  All items are securely stocked.
                </p>
              ) : (
                stats.lowStockProducts.map((p: Product, idx: number) => (
                  <div 
                    key={p.productId} 
                    style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "space-between", 
                      padding: "0.875rem 0", 
                      borderBottom: idx < stats.lowStockProducts.length - 1 ? "1px solid var(--border)" : "none" 
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: p.stock === 0 ? "#dc2626" : "#e8a45a" }} />
                      <span style={{ fontSize: "0.825rem", fontWeight: 600, color: "var(--fg-primary)" }}>{p.name}</span>
                    </div>
                    <span 
                      style={{ 
                        fontSize: "0.7rem", 
                        fontWeight: 700, 
                        color: p.stock === 0 ? "#c0392b" : "#8a5f10", 
                        background: p.stock === 0 ? "rgba(220,80,80,0.08)" : "rgba(220,160,80,0.08)", 
                        padding: "0.15rem 0.45rem", 
                        borderRadius: "var(--radius-sm)" 
                      }}
                    >
                      {p.stock === 0 ? "Out of Stock" : `${p.stock} units`}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* System Audit Log Activity Feed */}
          <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
            <div style={{ padding: "1.5rem 1.5rem 1.25rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Bell size={16} style={{ color: "var(--accent)" }} />
                <h3 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--fg-primary)", margin: 0 }}>System Notifications</h3>
              </div>
              <Link href="/admin/notifications" style={{ fontSize: "0.75rem", color: "var(--accent-dark)", textDecoration: "none", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                <span>View all</span>
                <ArrowUpRight size={13} />
              </Link>
            </div>
            <div style={{ padding: "0.5rem 1.5rem", maxHeight: 310, overflowY: "auto" }}>
              {!stats?.recentActivity || stats.recentActivity.length === 0 ? (
                <p style={{ fontSize: "0.8rem", color: "var(--fg-muted)", padding: "2rem 0", margin: 0, textAlign: "center" }}>
                  No notification records found.
                </p>
              ) : (
                stats.recentActivity.map((act: DashboardRecentActivity, index: number) => (
                  <div 
                    key={act.notificationId} 
                    style={{ 
                      padding: "0.875rem 0", 
                      borderBottom: index < stats.recentActivity.length - 1 ? "1px solid var(--border)" : "none", 
                      display: "flex", 
                      flexDirection: "column", 
                      gap: "0.25rem" 
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem" }}>
                      <span style={{ fontWeight: 700, color: "var(--fg-secondary)" }}>{act.title}</span>
                      <span style={{ color: "var(--fg-muted)" }}>{new Date(act.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}</span>
                    </div>
                    <p style={{ fontSize: "0.78rem", color: "var(--fg-muted)", margin: 0, lineHeight: 1.4 }}>{act.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 1200px) {
          div[style*="repeat(5, 1fr)"] { grid-template-columns: repeat(3, 1fr) !important; }
          div[style*="repeat(6, 1fr)"] { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 992px) {
          div[style*="gridTemplateColumns: 7.5fr 4.5fr"] { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          div[style*="repeat(5, 1fr)"] { grid-template-columns: 1fr 1fr !important; }
          div[style*="repeat(6, 1fr)"] { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}