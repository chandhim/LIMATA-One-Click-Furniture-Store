"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import { register as signUp } from "../api/auth";
import { registerSchema, type RegisterSchema } from "../schemas/auth.schemas";
import { useAuthStore } from "../store/use-auth-store";

export function RegisterForm() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      const session = await signUp(values);
      setSession(session);
      router.replace("/dashboard");
    } catch (error) {
      form.setError("root", {
        message: error instanceof Error ? error.message : "Registration failed",
      });
    }
  });

  const isSubmitting = form.formState.isSubmitting;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        background: "var(--bg-base)",
      }}
    >
      {/* Left: Brand Panel */}
      <div
        style={{
          background: "var(--bg-dark)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "2.5rem",
        }}
      >
        {/* Background decorations */}
        <div
          style={{
            position: "absolute",
            top: "-6rem",
            right: "-6rem",
            width: "28rem",
            height: "28rem",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(201,169,110,0.12) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-4rem",
            left: "-4rem",
            width: "20rem",
            height: "20rem",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(201,169,110,0.07) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle, rgba(250,249,247,0.03) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            pointerEvents: "none",
          }}
        />

        {/* Brand */}
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "var(--fg-inverse)",
            textDecoration: "none",
            letterSpacing: "-0.02em",
            display: "flex",
            alignItems: "center",
            gap: 4,
            position: "relative",
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
              marginBottom: 10,
              marginLeft: 2,
            }}
          />
        </Link>

        {/* Hero text */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: "1.25rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span style={{ width: "1.5rem", height: "1.5px", background: "var(--accent)", display: "block" }} />
            Join LIMATA
          </div>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2rem, 3.5vw, 3rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "var(--fg-inverse)",
              lineHeight: 1.1,
              marginBottom: "1.25rem",
            }}
          >
            Design the space
            <br />
            you deserve
          </h2>
          <p style={{ fontSize: "0.9375rem", color: "rgba(250,249,247,0.55)", lineHeight: 1.75, maxWidth: "24rem" }}>
            Create your free account and unlock 2,400+ curated furniture pieces, AR preview, and personalized recommendations.
          </p>

          {/* Perks list */}
          <div style={{ marginTop: "2.5rem", display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            {[
              { icon: "✓", text: "Free account — no credit card required" },
              { icon: "✓", text: "AR visualization for every product" },
              { icon: "✓", text: "AI-powered style recommendations" },
              { icon: "✓", text: "One-click checkout & fast delivery" },
            ].map((perk) => (
              <div
                key={perk.text}
                style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}
              >
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "rgba(201,169,110,0.2)",
                    border: "1px solid rgba(201,169,110,0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.625rem",
                    fontWeight: 700,
                    color: "var(--accent)",
                    flexShrink: 0,
                    marginTop: "0.125rem",
                  }}
                >
                  {perk.icon}
                </span>
                <span style={{ fontSize: "0.9rem", color: "rgba(250,249,247,0.65)", lineHeight: 1.5 }}>
                  {perk.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: "0.8rem", color: "rgba(250,249,247,0.25)", position: "relative" }}>
          © {new Date().getFullYear()} LIMATA
        </div>
      </div>

      {/* Right: Form Panel */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "3rem 2rem",
          background: "var(--bg-base)",
        }}
      >
        <div style={{ width: "100%", maxWidth: "26rem" }}>
          <div style={{ marginBottom: "2.5rem" }}>
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "2.25rem",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "var(--fg-primary)",
                marginBottom: "0.625rem",
                lineHeight: 1.15,
              }}
            >
              Create account
            </h1>
            <p style={{ fontSize: "0.9375rem", color: "var(--fg-secondary)", lineHeight: 1.6 }}>
              Already have one?{" "}
              <Link
                href="/login"
                style={{ color: "var(--accent-dark)", fontWeight: 600, textDecoration: "none" }}
              >
                Sign in →
              </Link>
            </p>
          </div>

          {/* Error Banner */}
          {form.formState.errors.root && (
            <div
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.25)",
                borderRadius: "var(--radius-md)",
                padding: "0.875rem 1rem",
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.625rem",
                fontSize: "0.875rem",
                color: "#b91c1c",
              }}
            >
              <span style={{ fontSize: "1rem" }}>⚠️</span>
              {form.formState.errors.root.message}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Name */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "var(--fg-primary)",
                  marginBottom: "0.5rem",
                  letterSpacing: "0.01em",
                }}
              >
                Full name
              </label>
              <input
                {...form.register("name")}
                type="text"
                placeholder="Your name"
                className="input-base"
              />
              {form.formState.errors.name && (
                <p style={{ marginTop: "0.375rem", fontSize: "0.8125rem", color: "#ef4444" }}>
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "var(--fg-primary)",
                  marginBottom: "0.5rem",
                  letterSpacing: "0.01em",
                }}
              >
                Email address
              </label>
              <input
                {...form.register("email")}
                type="email"
                placeholder="you@example.com"
                className="input-base"
              />
              {form.formState.errors.email && (
                <p style={{ marginTop: "0.375rem", fontSize: "0.8125rem", color: "#ef4444" }}>
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "var(--fg-primary)",
                  marginBottom: "0.5rem",
                  letterSpacing: "0.01em",
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  {...form.register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Choose a strong password"
                  className="input-base"
                  style={{ paddingRight: "3rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={{
                    position: "absolute",
                    right: "0.875rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1rem",
                    color: "var(--fg-muted)",
                    padding: 0,
                  }}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {form.formState.errors.password && (
                <p style={{ marginTop: "0.375rem", fontSize: "0.8125rem", color: "#ef4444" }}>
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-shimmer"
              style={{
                width: "100%",
                padding: "0.9375rem",
                fontSize: "0.9375rem",
                fontWeight: 700,
                color: "var(--fg-primary)",
                border: "none",
                borderRadius: "var(--radius-md)",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                opacity: isSubmitting ? 0.7 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                marginTop: "0.5rem",
              }}
            >
              {isSubmitting ? (
                <>
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      border: "2px solid rgba(28,26,23,0.3)",
                      borderTopColor: "var(--fg-primary)",
                      borderRadius: "50%",
                      display: "inline-block",
                      animation: "spin 0.7s linear infinite",
                    }}
                  />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </>
              )}
            </button>

            <p
              style={{
                textAlign: "center",
                fontSize: "0.8rem",
                color: "var(--fg-muted)",
                lineHeight: 1.6,
              }}
            >
              By creating an account, you agree to our{" "}
              <span style={{ color: "var(--fg-secondary)", textDecoration: "underline", cursor: "pointer" }}>
                Terms of Service
              </span>
              {" "}and{" "}
              <span style={{ color: "var(--fg-secondary)", textDecoration: "underline", cursor: "pointer" }}>
                Privacy Policy
              </span>
            </p>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="background: var(--bg-dark)"][style*="overflow: hidden"] {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}