"use client";

import Link from "next/link";

export function CTASection() {
  return (
    <section
      style={{
        background:
          "linear-gradient(135deg, #C9935A 0%, #A8724A 50%, #8A5A38 100%)",
        padding: "8rem 2rem",
        position: "relative",
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      {/* Subtle texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 30% 50%, rgba(255,230,190,0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(100,50,20,0.2) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "680px",
          margin: "0 auto",
          position: "relative",
        }}
      >
        {/* Label */}
        <div
          className="animate-fade-up"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.625rem",
            fontSize: "0.7rem",
            fontWeight: 600,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(255,240,220,0.7)",
            marginBottom: "1.5rem",
          }}
        >
          <span
            style={{
              display: "block",
              width: "1.5rem",
              height: "1px",
              background: "rgba(255,240,220,0.5)",
            }}
          />
          Start Shopping
          <span
            style={{
              display: "block",
              width: "1.5rem",
              height: "1px",
              background: "rgba(255,240,220,0.5)",
            }}
          />
        </div>

        {/* Headline */}
        <h2
          className="font-display animate-fade-up delay-100"
          style={{
            fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "#FAF9F7",
            lineHeight: 1.1,
            marginBottom: "1.125rem",
          }}
        >
          Ready to Find Your{" "}
          <em
            style={{
              fontStyle: "italic",
              fontWeight: 400,
              color: "rgba(255,240,210,0.85)",
            }}
          >
            Perfect
          </em>{" "}
          Furniture?
        </h2>

        {/* Subtext */}
        <p
          className="animate-fade-up delay-200"
          style={{
            fontSize: "1rem",
            color: "rgba(250,249,247,0.6)",
            lineHeight: 1.75,
            maxWidth: "32rem",
            margin: "0 auto 2.5rem",
          }}
        >
          Browse our curated collection of 2,400+ quality pieces and bring
          your dream space to life — one click at a time.
        </p>

        {/* Single CTA */}
        <div className="animate-fade-up delay-300">
          <Link
            href="/products"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.625rem",
              padding: "1.0625rem 2.5rem",
              fontSize: "0.9375rem",
              fontWeight: 700,
              color: "#8A5A38",
              background: "#FAF9F7",
              textDecoration: "none",
              borderRadius: "var(--radius-full)",
              letterSpacing: "0.01em",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              boxShadow: "0 4px 20px rgba(80,40,10,0.25)",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = "translateY(-2px)";
              el.style.boxShadow = "0 8px 32px rgba(80,40,10,0.35)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = "translateY(0)";
              el.style.boxShadow = "0 4px 20px rgba(80,40,10,0.25)";
            }}
          >
            Browse the Collection
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
