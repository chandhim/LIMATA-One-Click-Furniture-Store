"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useAuthBootstrap,
  useAuthGuard,
} from "@/features/auth/hooks/use-auth-session";
import { MainLayout } from "@/components/layout/main-layout";

export default function ProfileSetupPage() {
  useAuthBootstrap();
  const { isHydrated, isAuthenticated } = useAuthGuard();
  const router = useRouter();

  if (!isHydrated) return null;
  if (!isAuthenticated) return null;

  return (
    <MainLayout>
      <div
        style={{
          background: "var(--bg-base)",
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        <div
          style={{
            maxWidth: "500px",
            width: "100%",
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "3rem 2.5rem",
            textAlign: "center",
            boxShadow: "var(--shadow-lg)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative background */}
          <div
            style={{
              position: "absolute",
              top: "-5rem",
              right: "-5rem",
              width: "12rem",
              height: "12rem",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(201,169,110,0.08) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "rgba(201,169,110,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
              fontSize: "1.75rem",
              color: "var(--accent-dark)",
            }}
          >
            👤
          </div>

          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "2rem",
              fontWeight: 700,
              color: "var(--fg-primary)",
              marginBottom: "1rem",
            }}
          >
            Complete Profile
          </h1>

          <p
            style={{
              color: "var(--fg-secondary)",
              fontSize: "0.95rem",
              lineHeight: 1.6,
              marginBottom: "2.5rem",
            }}
          >
            Set up your delivery address and phone details now to speed up
            future checkout and enjoy a seamless ordering experience.
          </p>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <Link
              href="/profile?edit=true"
              style={{
                background: "var(--accent-dark)",
                color: "white",
                padding: "0.875rem",
                borderRadius: "var(--radius-md)",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "0.95rem",
                transition: "opacity 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Complete Now
            </Link>

            <button
              onClick={() => router.push("/dashboard")}
              style={{
                background: "transparent",
                border: "1.5px solid var(--border)",
                color: "var(--fg-secondary)",
                padding: "0.875rem",
                borderRadius: "var(--radius-md)",
                fontWeight: 600,
                fontSize: "0.95rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--fg-secondary)";
                e.currentTarget.style.color = "var(--fg-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--fg-secondary)";
              }}
            >
              Skip For Now
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
