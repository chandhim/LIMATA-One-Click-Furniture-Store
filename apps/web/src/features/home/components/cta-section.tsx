"use client";

import Link from "next/link";

export function CTASection() {
  return (
    <section
      style={{
        background: "linear-gradient(135deg, var(--bg-dark) 0%, #2D2520 50%, #1C1A17 100%)",
        padding: "7rem 1.5rem",
        position: "relative",
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      {/* Dot grid pattern overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(250,249,247,0.04) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          pointerEvents: "none",
        }}
      />

      {/* Warm glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "40rem",
          height: "20rem",
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(201,169,110,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative" }}>
        {/* Label */}
        <div
          className="animate-fade-up"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--accent)",
            marginBottom: "1.5rem",
          }}
        >
          <span style={{ width: "1.5rem", height: "1.5px", background: "var(--accent)", display: "block" }} />
          Start Shopping
          <span style={{ width: "1.5rem", height: "1.5px", background: "var(--accent)", display: "block" }} />
        </div>

        {/* Headline */}
        <h2
          className="font-display animate-fade-up delay-100"
          style={{
            fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "var(--fg-inverse)",
            lineHeight: 1.1,
            marginBottom: "1.25rem",
          }}
        >
          Ready to Find Your
          <br />
          <em style={{ fontStyle: "italic", color: "var(--accent)" }}>Perfect</em> Furniture?
        </h2>

        {/* Subtext */}
        <p
          className="animate-fade-up delay-200"
          style={{
            fontSize: "1.0625rem",
            color: "rgba(250,249,247,0.6)",
            lineHeight: 1.75,
            maxWidth: "34rem",
            margin: "0 auto 2.5rem",
          }}
        >
          Browse our curated collection of 2,400+ quality pieces and bring
          your dream space to life — one click at a time.
        </p>

        {/* CTA Buttons */}
        <div
          className="animate-fade-up delay-300"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            justifyContent: "center",
          }}
        >
          <Link
            href="/products"
            className="btn-shimmer"
            style={{
              padding: "1rem 2.25rem",
              fontSize: "1rem",
              fontWeight: 700,
              color: "var(--fg-primary)",
              textDecoration: "none",
              borderRadius: "var(--radius-full)",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              letterSpacing: "-0.01em",
            }}
          >
            Start Shopping
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
          <Link
            href="/register"
            style={{
              padding: "1rem 2.25rem",
              fontSize: "1rem",
              fontWeight: 600,
              color: "rgba(250,249,247,0.8)",
              textDecoration: "none",
              borderRadius: "var(--radius-full)",
              border: "1.5px solid rgba(250,249,247,0.2)",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "rgba(250,249,247,0.5)";
              el.style.color = "rgba(250,249,247,1)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "rgba(250,249,247,0.2)";
              el.style.color = "rgba(250,249,247,0.8)";
            }}
          >
            Create Free Account
          </Link>
        </div>
      </div>
    </section>
  );
}
