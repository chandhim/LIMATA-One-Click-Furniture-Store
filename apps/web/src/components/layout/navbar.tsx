"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/features/auth/store/use-auth-store";
import { NotificationCenter } from "@/features/notifications/components/notification-center";
import { MessageSquare, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/use-cart-store";
import { useCart } from "@/features/cart/hooks/use-cart";

export function Navbar() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const cartCount = useCartStore((s) => s.count);
  useCart(); // keeps the Zustand cart count in sync
  
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!dropdownOpen) return;
    const closeDropdown = () => setDropdownOpen(false);
    window.addEventListener("click", closeDropdown);
    return () => window.removeEventListener("click", closeDropdown);
  }, [dropdownOpen]);

  const handleLogout = () => {
    clearSession();
    router.push("/login");
  };


  return (
    <>
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          backgroundColor: scrolled
            ? "rgba(250,249,247,0.92)"
            : "rgba(250,249,247,0.75)",
          borderBottom: `1px solid ${scrolled ? "var(--border)" : "transparent"}`,
          boxShadow: scrolled ? "var(--shadow-md)" : "none",
          transition:
            "background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: scrolled ? "0.75rem 1.5rem" : "1.125rem 1.5rem",
            transition: "padding 0.3s ease",
          }}
        >
          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}>
            <Link
              href="/"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.375rem",
                fontWeight: 700,
                color: "var(--fg-primary)",
                letterSpacing: "-0.02em",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "2px",
              }}
            >
              LIMATA
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--accent)",
                  display: "inline-block",
                  marginLeft: 2,
                  marginBottom: 10,
                }}
              />
            </Link>

            {/* Desktop Nav Links */}
            <div
              className="nav-links"
              style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}
            >
              {[
                { label: "Home", href: "/" },
                { label: "Products", href: "/products" },
                { label: "Categories", href: "/#categories" },
                { label: "About", href: "/#about" },
                ...(isAuthenticated && !isAdmin ? [{ label: "My Orders", href: "/account/orders" }] : []),
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  style={{
                    padding: "0.5rem 0.875rem",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "var(--fg-secondary)",
                    textDecoration: "none",
                    borderRadius: "var(--radius-full)",
                    transition: "color 0.2s ease, background 0.2s ease",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color =
                      "var(--fg-primary)";
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(201,169,110,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color =
                      "var(--fg-secondary)";
                    (e.currentTarget as HTMLElement).style.background =
                      "transparent";
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Auth */}
          <div
            className="auth-buttons"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            {isAuthenticated ? (
              <>
                {/* Notification Center */}
                <NotificationCenter />

                {/* Chat quick-link */}
                {isAdmin && (
                  <Link
                    href="/admin/chats"
                    id="navbar-chat-link"
                    title="Messages"
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "transparent",
                      border: "1.5px solid transparent",
                      cursor: "pointer",
                      color: "var(--fg-secondary)",
                      textDecoration: "none",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        "var(--bg-elevated)";
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "var(--border)";
                      (e.currentTarget as HTMLElement).style.color =
                        "var(--fg-primary)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        "transparent";
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "transparent";
                      (e.currentTarget as HTMLElement).style.color =
                        "var(--fg-secondary)";
                    }}
                  >
                    <MessageSquare size={18} />
                  </Link>
                )}

                {/* Cart quick-link */}
                <Link
                  href="/cart"
                  id="navbar-cart-link"
                  title="Cart"
                  style={{
                    position: "relative",
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "transparent",
                    border: "1.5px solid transparent",
                    cursor: "pointer",
                    color: "var(--fg-secondary)",
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "var(--bg-elevated)";
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "var(--border)";
                    (e.currentTarget as HTMLElement).style.color =
                      "var(--fg-primary)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "transparent";
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "transparent";
                    (e.currentTarget as HTMLElement).style.color =
                      "var(--fg-secondary)";
                  }}
                >
                  <ShoppingCart size={18} />
                  {cartCount > 0 && (
                    <span
                      className="font-numeric"
                      style={{
                        position: "absolute",
                        top: "-4px",
                        right: "-6px",
                        minWidth: "16px",
                        height: "16px",
                        background: "var(--accent)",
                        color: "var(--fg-primary)",
                        borderRadius: "var(--radius-full)",
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0 4px",
                        border: "2px solid var(--bg-base)",
                        lineHeight: 1,
                      }}
                    >
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </Link>

                {/* User avatar + dropdown */}
                <div style={{ position: "relative" }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isAdmin) {
                        router.push("/profile");
                      } else {
                        setDropdownOpen(!dropdownOpen);
                      }
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.625rem",
                      padding: "0.375rem 0.75rem",
                      background: "var(--bg-elevated)",
                      borderRadius: "var(--radius-full)",
                      border: "1px solid var(--border)",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      outline: "none",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        "rgba(201,169,110,0.08)";
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "var(--accent)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        "var(--bg-elevated)";
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "var(--border)";
                    }}
                  >
                    {user?.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          objectFit: "cover",
                          flexShrink: 0,
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: "#fff",
                          flexShrink: 0,
                        }}
                      >
                        {user?.name?.[0]?.toUpperCase() ?? "U"}
                      </div>
                    )}
                    <span
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        color: "var(--fg-primary)",
                      }}
                    >
                      {user?.name}
                    </span>
                    <span style={{ fontSize: "0.6rem", color: "var(--fg-muted)" }}>
                      {isAdmin ? "▼" : "›"}
                    </span>
                  </button>

                  {isAdmin && dropdownOpen && (
                    <div
                      style={{
                        position: "absolute",
                        right: 0,
                        marginTop: "0.5rem",
                        width: "12.5rem",
                        background: "rgba(250,249,247,0.95)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-md)",
                        boxShadow: "var(--shadow-lg)",
                        padding: "0.5rem 0",
                        zIndex: 100,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {user?.role === "ADMIN" && (
                        <Link
                          href="/admin"
                          onClick={() => setDropdownOpen(false)}
                          style={{
                            padding: "0.625rem 1rem",
                            fontSize: "0.875rem",
                            color: "var(--fg-secondary)",
                            textDecoration: "none",
                            textAlign: "left",
                            transition: "all 0.2s ease",
                          }}
                          className="dropdown-item"
                        >
                          🛡️ Admin Dashboard
                        </Link>
                      )}
                      <Link
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                        style={{
                          padding: "0.625rem 1rem",
                          fontSize: "0.875rem",
                          color: "var(--fg-secondary)",
                          textDecoration: "none",
                          textAlign: "left",
                          transition: "all 0.2s ease",
                        }}
                        className="dropdown-item"
                      >
                        My Profile
                      </Link>
                      <Link
                        href="/account/orders"
                        onClick={() => setDropdownOpen(false)}
                        style={{
                          padding: "0.625rem 1rem",
                          fontSize: "0.875rem",
                          color: "var(--fg-secondary)",
                          textDecoration: "none",
                          textAlign: "left",
                          transition: "all 0.2s ease",
                        }}
                        className="dropdown-item"
                      >
                        My Orders
                      </Link>
                      <Link
                        href="/notifications"
                        onClick={() => setDropdownOpen(false)}
                        style={{
                          padding: "0.625rem 1rem",
                          fontSize: "0.875rem",
                          color: "var(--fg-secondary)",
                          textDecoration: "none",
                          textAlign: "left",
                          transition: "all 0.2s ease",
                        }}
                        className="dropdown-item"
                      >
                        Notifications
                      </Link>
                      <hr style={{ border: 0, borderTop: "1px solid var(--border)", margin: "0.375rem 0" }} />
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          handleLogout();
                        }}
                        style={{
                          padding: "0.625rem 1rem",
                          fontSize: "0.875rem",
                          color: "#ef4444",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          textAlign: "left",
                          width: "100%",
                          transition: "all 0.2s ease",
                        }}
                        className="dropdown-item-logout"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  style={{
                    padding: "0.5rem 1rem",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "var(--fg-secondary)",
                    textDecoration: "none",
                    borderRadius: "var(--radius-full)",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.color =
                      "var(--fg-primary)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.color =
                      "var(--fg-secondary)")
                  }
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="btn-shimmer"
                  style={{
                    padding: "0.5rem 1.25rem",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "var(--fg-primary)",
                    textDecoration: "none",
                    borderRadius: "var(--radius-full)",
                    display: "inline-block",
                  }}
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            style={{
              display: "none",
              width: 40,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              cursor: "pointer",
              flexDirection: "column",
              gap: 5,
              padding: 0,
            }}
          >
            <span
              style={{
                display: "block",
                width: 18,
                height: 1.5,
                background: "var(--fg-primary)",
                borderRadius: 2,
                transition: "transform 0.25s ease, opacity 0.25s ease",
                transform: open ? "rotate(45deg) translate(4px, 4px)" : "none",
              }}
            />
            <span
              style={{
                display: "block",
                width: 18,
                height: 1.5,
                background: "var(--fg-primary)",
                borderRadius: 2,
                transition: "opacity 0.25s ease",
                opacity: open ? 0 : 1,
              }}
            />
            <span
              style={{
                display: "block",
                width: 18,
                height: 1.5,
                background: "var(--fg-primary)",
                borderRadius: 2,
                transition: "transform 0.25s ease, opacity 0.25s ease",
                transform: open
                  ? "rotate(-45deg) translate(4px, -4px)"
                  : "none",
              }}
            />
          </button>
        </div>

        {/* Mobile Drawer */}
        {open && (
          <div
            className="animate-slide-down"
            style={{
              borderTop: "1px solid var(--border)",
              background: "rgba(250,249,247,0.98)",
              backdropFilter: "blur(16px)",
              padding: "1.25rem 1.5rem 1.5rem",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
              }}
            >
              {[
                { label: "Home", href: "/" },
                { label: "Products", href: "/products" },
                { label: "Categories", href: "/#categories" },
                { label: "About", href: "/#about" },
              ].map((item, i) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`animate-fade-up delay-${(i + 1) * 100}`}
                  style={{
                    padding: "0.75rem 1rem",
                    fontSize: "1rem",
                    fontWeight: 500,
                    color: "var(--fg-primary)",
                    textDecoration: "none",
                    borderRadius: "var(--radius-md)",
                    transition: "background 0.2s ease",
                  }}
                >
                  {item.label}
                </Link>
              ))}

              {isAuthenticated ? (
                <div
                  style={{
                    marginTop: "1rem",
                    paddingTop: "1rem",
                    borderTop: "1px solid var(--border)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  {user?.role === "ADMIN" ? (
                    <Link
                      href="/admin"
                      onClick={() => setOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.625rem",
                        padding: "0.75rem 1rem",
                        borderRadius: "var(--radius-md)",
                        border: "1.5px solid var(--border)",
                        fontSize: "0.9rem",
                        fontWeight: 500,
                        color: "var(--fg-primary)",
                        textDecoration: "none",
                        background: "rgba(201,169,110,0.05)",
                        borderColor: "var(--accent)",
                      }}
                    >
                      🛡️ Admin Dashboard
                    </Link>
                  ) : (
                    <Link
                      href="/profile"
                      onClick={() => setOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.625rem",
                        padding: "0.75rem 1rem",
                        borderRadius: "var(--radius-md)",
                        border: "1.5px solid var(--border)",
                        fontSize: "0.9rem",
                        fontWeight: 500,
                        color: "var(--fg-primary)",
                        textDecoration: "none",
                      }}
                    >
                      👤 Profile
                    </Link>
                  )}
                  {isAdmin && (
                    <Link
                      href="/admin/chats"
                      onClick={() => setOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.625rem",
                        padding: "0.75rem 1rem",
                        borderRadius: "var(--radius-md)",
                        border: "1.5px solid var(--border)",
                        fontSize: "0.9rem",
                        fontWeight: 500,
                        color: "var(--fg-primary)",
                        textDecoration: "none",
                      }}
                    >
                      <MessageSquare size={16} /> Messages
                    </Link>
                  )}

                  <Link
                    href="/cart"
                    onClick={() => setOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.75rem 1rem",
                      borderRadius: "var(--radius-md)",
                      border: "1.5px solid var(--border)",
                      fontSize: "0.9rem",
                      fontWeight: 500,
                      color: "var(--fg-primary)",
                      textDecoration: "none",
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                      <ShoppingCart size={16} /> Cart
                    </span>
                    {cartCount > 0 && (
                      <span
                        className="font-numeric"
                        style={{
                          background: "var(--accent)",
                          color: "var(--fg-primary)",
                          borderRadius: "var(--radius-full)",
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          padding: "0.1rem 0.45rem",
                          lineHeight: 1.4,
                        }}
                      >
                        {cartCount}
                      </span>
                    )}
                  </Link>
                  <button
                    onClick={() => { setOpen(false); handleLogout(); }}
                    style={{
                      padding: "0.75rem",
                      borderRadius: "var(--radius-md)",
                      border: "1.5px solid #e74c3c",
                      background: "transparent",
                      fontSize: "0.9rem",
                      fontWeight: 500,
                      color: "#e74c3c",
                      cursor: "pointer",
                    }}
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    marginTop: "1rem",
                    paddingTop: "1rem",
                    borderTop: "1px solid var(--border)",
                    display: "flex",
                    gap: "0.75rem",
                  }}
                >
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    style={{
                      flex: 1,
                      textAlign: "center",
                      padding: "0.75rem",
                      border: "1.5px solid var(--border)",
                      borderRadius: "var(--radius-md)",
                      fontSize: "0.9rem",
                      fontWeight: 500,
                      color: "var(--fg-primary)",
                      textDecoration: "none",
                    }}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="btn-shimmer"
                    style={{
                      flex: 1,
                      textAlign: "center",
                      padding: "0.75rem",
                      borderRadius: "var(--radius-md)",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "var(--fg-primary)",
                      textDecoration: "none",
                    }}
                  >
                    Get started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Responsive visibility via <style> */}
      <style>{`
        @media (max-width: 768px) {
          .nav-links, .auth-buttons { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
        }
        .dropdown-item:hover {
          background: rgba(201, 169, 110, 0.1) !important;
          color: var(--fg-primary) !important;
        }
        .dropdown-item-logout:hover {
          background: rgba(239, 68, 68, 0.08) !important;
        }
      `}</style>
    </>
  );
}
