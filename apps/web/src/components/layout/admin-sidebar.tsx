"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store/use-auth-store";
import {
  LayoutDashboard,
  Home,
  FolderTree,
  FileText,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Users,
  Star,
  MessageSquare,
  Bell,
  ArrowUpRight,
  LogOut,
  Truck,
} from "lucide-react";

type NavGroup = {
  group: string;
  items: {
    label: string;
    href: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
  }[];
};

const navGroups: NavGroup[] = [
  {
    group: "Core",
    items: [{ label: "Overview", href: "/admin", icon: LayoutDashboard }],
  },
  {
    group: "Catalog",
    items: [
      { label: "Products", href: "/admin/products", icon: ShoppingBag },
      { label: "Categories", href: "/admin/categories", icon: FolderTree },
    ],
  },
  {
    group: "Sales",
    items: [{ label: "Orders", href: "/admin/orders", icon: ShoppingCart }],
  },
  {
    group: "Users",
    items: [
      { label: "Customers", href: "/admin/customers", icon: Users },
    ],
  },
  {
    group: "Communication",
    items: [
      { label: "Chats", href: "/admin/chats", icon: MessageSquare },
      { label: "Notifications", href: "/admin/notifications", icon: Bell },
    ],
  },
  {
    group: "Settings",
    items: [
      { label: "Homepage Content", href: "/admin/homepage", icon: Home },
      { label: "Footer Links", href: "/admin/footer", icon: FileText },
      { label: "Delivery Rates", href: "/admin/delivery", icon: Truck },
      { label: "Store Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

export function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const clearSession = useAuthStore((s) => s.clearSession);

  function handleLogout() {
    clearSession();
    router.push("/login");
  }

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <aside
      style={{
        width: 250,
        height: "100%",
        background: "var(--bg-surface)",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid var(--border)",
        flexShrink: 0,
        position: "relative",
      }}
    >
      {/* Brand Logo Header */}
      <div
        style={{
          padding: "1.75rem 1.5rem 1.5rem",
          borderBottom: "1px solid rgba(250,249,247,0.06)",
        }}
      >
        <Link
          href="/admin"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <span
            className="font-serif"
            style={{
              fontSize: "1.4rem",
              fontWeight: 700,
              color: "var(--fg-primary)",
              letterSpacing: "-0.01em",
            }}
          >
            LIMATA
          </span>
          <span
            style={{
              fontSize: "0.625rem",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--accent)",
              background: "rgba(201,169,110,0.12)",
              border: "1px solid var(--accent)",
              borderRadius: "4px",
              padding: "0.15rem 0.5rem",
            }}
          >
            Admin
          </span>
        </Link>
      </div>

      {/* Navigation Options */}
      <nav
        style={{
          flex: 1,
          padding: "1.25rem 0.75rem",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {navGroups.map(({ group, items }) => (
          <div
            key={group}
            style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
          >
            {/* Group Label Title */}
            <div
              style={{
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "var(--fg-muted)",
                padding: "0.5rem 0.75rem 0.25rem",
              }}
            >
              {group}
            </div>

            {items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.625rem 0.75rem",
                    fontSize: "0.875rem",
                    fontWeight: active ? 600 : 500,
                    color: active
                      ? "var(--accent-dark)"
                      : "var(--fg-secondary)",
                    textDecoration: "none",
                    background: active
                      ? "rgba(201,169,110,0.12)"
                      : "transparent",
                    borderRadius: "var(--radius-md)",
                    transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      const el = e.currentTarget as HTMLElement;
                      el.style.color = "var(--fg-primary)";
                      el.style.background = "var(--bg-elevated)";
                      const iconSpan = el.firstElementChild as HTMLElement;
                      if (iconSpan) iconSpan.style.color = "var(--accent-dark)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      const el = e.currentTarget as HTMLElement;
                      el.style.color = "var(--fg-secondary)";
                      el.style.background = "transparent";
                      const iconSpan = el.firstElementChild as HTMLElement;
                      if (iconSpan) iconSpan.style.color = "var(--fg-muted)";
                    }
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      color: active ? "var(--accent-dark)" : "var(--fg-muted)",
                      transition: "color 0.2s ease",
                    }}
                  >
                    <Icon size={16} />
                  </span>
                  <span>{item.label}</span>
                  {active && (
                    <span
                      style={{
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        background: "var(--accent-dark)",
                        boxShadow: "0 0 8px var(--accent)",
                        marginLeft: "auto",
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User Session & Profiles Summary Footer */}
      <div
        style={{
          padding: "1.25rem 1rem",
          borderTop: "1px solid var(--border)",
          background: "var(--bg-elevated)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "0.875rem",
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.875rem",
              fontWeight: 700,
              color: "#1C1A17",
              flexShrink: 0,
              border: "1px solid rgba(250,249,247,0.15)",
              boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
            }}
          >
            {user?.name?.[0]?.toUpperCase() ?? "A"}
          </div>
          <div style={{ overflow: "hidden" }}>
            <div
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--fg-primary)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.name ?? "Admin"}
            </div>
            <div
              style={{
                fontSize: "0.7rem",
                color: "var(--fg-secondary)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.email ?? ""}
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "0.5rem",
            fontSize: "0.8rem",
            fontWeight: 600,
            color: "var(--fg-secondary)",
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = "rgba(239, 68, 68, 0.25)";
            el.style.color = "#ef4444";
            el.style.background = "rgba(239, 68, 68, 0.05)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = "var(--border)";
            el.style.color = "var(--fg-secondary)";
            el.style.background = "var(--bg-surface)";
          }}
        >
          <LogOut size={13} />
          Sign out
        </button>

        <Link
          href="/"
          target="_blank"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.25rem",
            marginTop: "0.625rem",
            fontSize: "0.75rem",
            color: "var(--fg-muted)",
            textDecoration: "none",
            transition: "color 0.2s ease",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.color =
              "var(--accent-dark)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.color = "var(--fg-muted)")
          }
        >
          <span>View Storefront</span>
          <ArrowUpRight size={12} />
        </Link>
      </div>
    </aside>
  );
}
