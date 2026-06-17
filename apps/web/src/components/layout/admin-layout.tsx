"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AdminSidebar } from "./admin-sidebar";
import { useAuthStore } from "@/features/auth/store/use-auth-store";
import { Menu, ArrowUpRight, ChevronRight } from "lucide-react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  const getPageTitle = (path: string) => {
    if (path === "/admin") return "Overview";
    if (path.startsWith("/admin/products")) return "Products";
    if (path.startsWith("/admin/categories")) return "Categories";
    if (path.startsWith("/admin/orders")) return "Orders";
    if (path.startsWith("/admin/customers")) return "Customers";
    if (path.startsWith("/admin/reviews")) return "Reviews";
    if (path.startsWith("/admin/chats")) return "Chats";
    if (path.startsWith("/admin/notifications")) return "Notifications";
    if (path.startsWith("/admin/homepage")) return "Homepage Content";
    if (path.startsWith("/admin/footer")) return "Footer Links";
    if (path.startsWith("/admin/settings")) return "Store Settings";
    return "Dashboard";
  };

  const getPageCategory = (path: string) => {
    if (path === "/admin") return "Core";
    if (path.startsWith("/admin/products") || path.startsWith("/admin/categories")) return "Catalog";
    if (path.startsWith("/admin/orders")) return "Sales";
    if (path.startsWith("/admin/customers") || path.startsWith("/admin/reviews")) return "Users";
    if (path.startsWith("/admin/chats") || path.startsWith("/admin/notifications")) return "Communication";
    if (path.startsWith("/admin/homepage") || path.startsWith("/admin/footer") || path.startsWith("/admin/settings")) return "Settings";
    return "Admin";
  };

  const category = getPageCategory(pathname);
  const title = getPageTitle(pathname);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--bg-base)",
      }}
    >
      {/* Desktop sidebar */}
      <div className="admin-sidebar-desktop">
        <AdminSidebar />
      </div>

      {/* Mobile sidebar overlay drawer */}
      {sidebarOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            display: "flex",
          }}
        >
          {/* Backdrop */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(28,26,23,0.4)",
              backdropFilter: "blur(4px)",
              animation: "fadeIn 0.2s ease-out",
            }}
            onClick={() => setSidebarOpen(false)}
          />
          {/* Sidebar drawer container */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              animation: "slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <AdminSidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        {/* Sticky Top Header Bar */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "64px",
            padding: "0 1.5rem",
            background: "rgba(250, 249, 247, 0.85)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          {/* Left: Hamburger (mobile) or Breadcrumbs (desktop) */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button
              className="admin-hamburger"
              onClick={() => setSidebarOpen(true)}
              style={{
                display: "none",
                background: "transparent",
                border: "none",
                padding: "0.375rem",
                cursor: "pointer",
                color: "var(--fg-primary)",
                borderRadius: "var(--radius-sm)",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(28,26,23,0.05)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
            >
              <Menu size={20} />
            </button>

            {/* Breadcrumbs for desktop, Logo for mobile */}
            <div className="admin-header-breadcrumbs" style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.825rem", color: "var(--fg-secondary)" }}>
              <span>Admin</span>
              <ChevronRight size={12} style={{ opacity: 0.5 }} />
              <span>{category}</span>
              <ChevronRight size={12} style={{ opacity: 0.5 }} />
              <span style={{ fontWeight: 600, color: "var(--fg-primary)" }}>{title}</span>
            </div>

            <div className="admin-header-logo-mobile" style={{ display: "none", alignItems: "center", gap: "0.5rem" }}>
              <span className="font-serif" style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--fg-primary)" }}>
                LIMATA
              </span>
              <span
                style={{
                  fontSize: "0.55rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--accent)",
                  background: "rgba(201,169,110,0.1)",
                  border: "1px solid rgba(201,169,110,0.2)",
                  borderRadius: "3px",
                  padding: "0.05rem 0.35rem",
                }}
              >
                Admin
              </span>
            </div>
          </div>

          {/* Right: Storefront quick link and profile */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link
              href="/"
              target="_blank"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
                fontSize: "0.8rem",
                fontWeight: 500,
                color: "var(--fg-secondary)",
                textDecoration: "none",
                padding: "0.375rem 0.75rem",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border)",
                background: "var(--bg-surface)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.color = "var(--fg-primary)";
                el.style.borderColor = "var(--border-strong)";
                el.style.boxShadow = "var(--shadow-sm)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.color = "var(--fg-secondary)";
                el.style.borderColor = "var(--border)";
                el.style.boxShadow = "none";
              }}
            >
              <span>Storefront</span>
              <ArrowUpRight size={13} />
            </Link>

            {/* Profile Avatar Pill */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.25rem 0.5rem 0.25rem 0.25rem",
                borderRadius: "var(--radius-full)",
                background: "rgba(201,169,110,0.06)",
                border: "1px solid rgba(201,169,110,0.12)",
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#1C1A17",
                  border: "1px solid rgba(250,249,247,0.1)",
                }}
              >
                {user?.name?.[0]?.toUpperCase() ?? "A"}
              </div>
              <span className="admin-header-username" style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--fg-primary)" }}>
                {user?.name ?? "Admin"}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: "auto" }}>{children}</main>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @media (max-width: 768px) {
          .admin-sidebar-desktop { display: none !important; }
          .admin-hamburger { display: flex !important; }
          .admin-header-breadcrumbs { display: none !important; }
          .admin-header-logo-mobile { display: flex !important; }
          .admin-header-username { display: none !important; }
        }
      `}</style>
    </div>
  );
}
