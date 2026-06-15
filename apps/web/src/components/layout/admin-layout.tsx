"use client";

import { useState } from "react";
import { AdminSidebar } from "./admin-sidebar";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

      {/* Mobile sidebar overlay */}
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
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(4px)",
            }}
            onClick={() => setSidebarOpen(false)}
          />
          {/* Sidebar */}
          <div style={{ position: "relative", zIndex: 1 }}>
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
        {/* Mobile top bar */}
        <div
          className="admin-mobile-topbar"
          style={{
            display: "none",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem 1.25rem",
            background: "var(--bg-dark)",
            borderBottom: "1px solid rgba(250,249,247,0.06)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.125rem",
              fontWeight: 700,
              color: "#FAF9F7",
            }}
          >
            LIMATA
            <span
              style={{
                fontSize: "0.6rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--accent)",
                marginLeft: "0.5rem",
              }}
            >
              Admin
            </span>
          </span>
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              background: "rgba(250,249,247,0.08)",
              border: "none",
              borderRadius: "var(--radius-sm)",
              padding: "0.5rem",
              cursor: "pointer",
              color: "#FAF9F7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ☰
          </button>
        </div>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: "auto" }}>{children}</main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar-desktop { display: none !important; }
          .admin-mobile-topbar { display: flex !important; }
        }
        @media (min-width: 769px) {
          .admin-mobile-topbar { display: none !important; }
        }
      `}</style>
    </div>
  );
}
