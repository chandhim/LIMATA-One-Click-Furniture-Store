"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import { login } from "../api/auth";
import { loginSchema, type LoginSchema } from "../schemas/auth.schemas";
import { useAuthStore } from "../store/use-auth-store";

export function LoginForm() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      const session = await login(values);
      setSession(session);
      router.replace("/dashboard");
    } catch (error) {
      form.setError("root", {
        message: error instanceof Error ? error.message : "Login failed",
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
            Welcome Back
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
            Your perfect
            <br />
            space awaits
          </h2>
          <p style={{ fontSize: "0.9375rem", color: "rgba(250,249,247,0.55)", lineHeight: 1.75, maxWidth: "24rem" }}>
            Sign in to continue your furniture journey — curated picks, AR preview, and one-click checkout.
          </p>

          {/* Testimonial card */}
          <div
            style={{
              marginTop: "2.5rem",
              background: "rgba(250,249,247,0.06)",
              border: "1px solid rgba(250,249,247,0.1)",
              borderRadius: "var(--radius-lg)",
              padding: "1.5rem",
            }}
          >
            <p style={{ fontSize: "0.9rem", color: "rgba(250,249,247,0.7)", lineHeight: 1.7, fontStyle: "italic", marginBottom: "1rem" }}>
              "LIMATA made furnishing my apartment effortless. The AR feature is mind-blowing."
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                S
              </div>
              <div>
                <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--fg-inverse)" }}>Sara M.</div>
                <div style={{ fontSize: "0.75rem", color: "rgba(250,249,247,0.45)" }}>Interior Designer</div>
              </div>
              <div style={{ marginLeft: "auto", color: "var(--accent)", fontSize: "0.9rem" }}>★★★★★</div>
            </div>
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
              Sign in
            </h1>
            <p style={{ fontSize: "0.9375rem", color: "var(--fg-secondary)", lineHeight: 1.6 }}>
              Don't have an account?{" "}
              <Link
                href="/register"
                style={{ color: "var(--accent-dark)", fontWeight: 600, textDecoration: "none" }}
              >
                Create one free →
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
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <label
                  style={{
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: "var(--fg-primary)",
                    letterSpacing: "0.01em",
                  }}
                >
                  Password
                </label>
                <span
                  style={{ fontSize: "0.8125rem", color: "var(--accent-dark)", cursor: "pointer", fontWeight: 500 }}
                >
                  Forgot password?
                </span>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  {...form.register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
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
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </>
              )}
            </button>
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