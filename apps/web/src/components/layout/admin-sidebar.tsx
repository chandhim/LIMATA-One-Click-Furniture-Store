"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/features/auth/store/use-auth-store";

type NavItem = {
  label: string;
  href?: string;
  icon: string;
  children?: { label: string; href: string; icon: string }[];
};

const navGroups: { group: string; items: NavItem[] }[] = [
  {
    group: "",
    items: [{ label: "Overview", href: "/admin", icon: "◈" }],
  },
  {
    group: "Storefront",
    items: [
      {
        label: "Storefront",
        icon: "⊹",
        children: [
          { label: "Homepage", href: "/admin/homepage", icon: "⌂" },
          { label: "Categories", href: "/admin/categories", icon: "▤" },
          { label: "Footer", href: "/admin/footer", icon: "▭" },
          { label: "Site Settings", href: "/admin/settings", icon: "⚙" },
        ],
      },
    ],
  },
  {
    group: "Catalog",
    items: [
      {
        label: "Catalog",
        icon: "⊹",
        children: [
          { label: "Products", href: "/admin/products", icon: "◻" },
        ],
      },
    ],
  },
  {
    group: "Sales",
    items: [
      {
        label: "Sales",
        icon: "⊹",
        children: [
          { label: "Orders", href: "/admin/orders", icon: "◈" },
        ],
      },
    ],
  },
  {
    group: "Users",
    items: [
      {
        label: "Users",
        icon: "⊹",
        children: [
          { label: "Customers", href: "/admin/customers", icon: "◯" },
          { label: "Reviews", href: "/admin/reviews", icon: "◇" },
        ],
      },
    ],
  },
];

export function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const clearSession = useAuthStore((s) => s.clearSession);

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Storefront: true,
    Catalog: true,
    Sales: false,
    Users: false,
  });

  function toggleGroup(group: string) {
    setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  }

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
        width: 240,
        minHeight: "100vh",
        background: "var(--bg-dark)",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid rgba(250,249,247,0.06)",
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "1.5rem 1.25rem 1.25rem",
          borderBottom: "1px solid rgba(250,249,247,0.06)",
        }}
      >
        <Link
          href="/admin"
          style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.625rem" }}
        >
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "#FAF9F7",
              letterSpacing: "-0.02em",
            }}
          >
            LIMATA
          </span>
          <span
            style={{
              fontSize: "0.6rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--accent)",
              background: "rgba(201,169,110,0.15)",
              border: "1px solid rgba(201,169,110,0.25)",
              borderRadius: "4px",
              padding: "0.15rem 0.45rem",
            }}
          >
            Admin
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "1rem 0", overflowY: "auto" }}>
        {navGroups.map(({ group, items }) => (
          <div key={group || "root"} style={{ marginBottom: "0.25rem" }}>
            {/* Group label */}
            {group && (
              <div
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(250,249,247,0.3)",
                  padding: "0.75rem 1.25rem 0.35rem",
                }}
              >
                {group}
              </div>
            )}

            {items.map((item) => {
              // Simple link
              if (item.href) {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.625rem",
                      padding: "0.6rem 1.25rem",
                      fontSize: "0.875rem",
                      fontWeight: active ? 600 : 400,
                      color: active ? "#FAF9F7" : "rgba(250,249,247,0.55)",
                      textDecoration: "none",
                      background: active
                        ? "rgba(201,169,110,0.12)"
                        : "transparent",
                      borderLeft: active
                        ? "2px solid var(--accent)"
                        : "2px solid transparent",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!active)
                        (e.currentTarget as HTMLElement).style.color =
                          "rgba(250,249,247,0.85)";
                    }}
                    onMouseLeave={(e) => {
                      if (!active)
                        (e.currentTarget as HTMLElement).style.color =
                          "rgba(250,249,247,0.55)";
                    }}
                  >
                    <span style={{ fontSize: "0.875rem", opacity: 0.7 }}>
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                );
              }

              // Collapsible group
              const isOpen = openGroups[item.label];
              const anyChildActive = item.children?.some((c) =>
                isActive(c.href)
              );

              return (
                <div key={item.label}>
                  <button
                    onClick={() => toggleGroup(item.label)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      padding: "0.6rem 1.25rem",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: anyChildActive
                        ? "var(--accent)"
                        : "rgba(250,249,247,0.4)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "color 0.15s ease",
                    }}
                  >
                    {item.label}
                    <span
                      style={{
                        fontSize: "0.6rem",
                        transition: "transform 0.2s ease",
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        display: "inline-block",
                      }}
                    >
                      ▾
                    </span>
                  </button>

                  {isOpen &&
                    item.children?.map((child) => {
                      const childActive = isActive(child.href);
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={onClose}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.55rem 1.25rem 0.55rem 2.25rem",
                            fontSize: "0.855rem",
                            fontWeight: childActive ? 600 : 400,
                            color: childActive
                              ? "#FAF9F7"
                              : "rgba(250,249,247,0.5)",
                            textDecoration: "none",
                            background: childActive
                              ? "rgba(201,169,110,0.1)"
                              : "transparent",
                            borderLeft: childActive
                              ? "2px solid var(--accent)"
                              : "2px solid transparent",
                            transition: "all 0.15s ease",
                          }}
                          onMouseEnter={(e) => {
                            if (!childActive)
                              (e.currentTarget as HTMLElement).style.color =
                                "rgba(250,249,247,0.8)";
                          }}
                          onMouseLeave={(e) => {
                            if (!childActive)
                              (e.currentTarget as HTMLElement).style.color =
                                "rgba(250,249,247,0.5)";
                          }}
                        >
                          <span style={{ fontSize: "0.75rem", opacity: 0.6 }}>
                            {child.icon}
                          </span>
                          {child.label}
                        </Link>
                      );
                    })}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User profile + sign out */}
      <div
        style={{
          padding: "1rem 1.25rem",
          borderTop: "1px solid rgba(250,249,247,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.625rem",
            marginBottom: "0.75rem",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "#fff",
              flexShrink: 0,
            }}
          >
            {user?.name?.[0]?.toUpperCase() ?? "A"}
          </div>
          <div style={{ overflow: "hidden" }}>
            <div
              style={{
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "#FAF9F7",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.name ?? "Admin"}
            </div>
            <div
              style={{
                fontSize: "0.68rem",
                color: "rgba(250,249,247,0.4)",
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
            padding: "0.5rem 0.75rem",
            fontSize: "0.8rem",
            fontWeight: 500,
            color: "rgba(250,249,247,0.5)",
            background: "transparent",
            border: "1px solid rgba(250,249,247,0.08)",
            borderRadius: "var(--radius-sm)",
            cursor: "pointer",
            textAlign: "center",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = "rgba(231,76,60,0.4)";
            el.style.color = "#e74c3c";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = "rgba(250,249,247,0.08)";
            el.style.color = "rgba(250,249,247,0.5)";
          }}
        >
          Sign out
        </button>

        {/* View storefront link */}
        <Link
          href="/"
          target="_blank"
          style={{
            display: "block",
            marginTop: "0.5rem",
            padding: "0.4rem 0.75rem",
            fontSize: "0.75rem",
            color: "rgba(250,249,247,0.3)",
            textDecoration: "none",
            textAlign: "center",
            transition: "color 0.2s ease",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.color =
              "rgba(250,249,247,0.6)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.color =
              "rgba(250,249,247,0.3)")
          }
        >
          ↗ View Storefront
        </Link>
      </div>
    </aside>
  );
}
