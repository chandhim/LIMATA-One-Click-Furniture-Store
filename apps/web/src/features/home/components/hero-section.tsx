"use client";

import Link from "next/link";

export function HeroSection() {
  return (
    <section
      style={{
        background: "var(--bg-base)",
        minHeight: "calc(100vh - 72px)",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decorative blobs */}
      <div
        style={{
          position: "absolute",
          top: "-8rem",
          right: "-6rem",
          width: "42rem",
          height: "42rem",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,169,110,0.12) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-6rem",
          left: "-8rem",
          width: "36rem",
          height: "36rem",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,169,110,0.07) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      {/* Dot grid pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(28,26,23,0.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "5rem 1.5rem",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4rem",
          alignItems: "center",
          width: "100%",
          position: "relative",
        }}
      >
        {/* Left: Text Content */}
        <div>
          {/* Label */}
          <div className="section-label animate-fade-up" style={{ marginBottom: "1.5rem" }}>
            One-Click Furniture Store
          </div>

          {/* Headline */}
          <h1
            className="font-display animate-fade-up delay-100"
            style={{
              fontSize: "clamp(2.75rem, 5vw, 4.25rem)",
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              color: "var(--fg-primary)",
              marginBottom: "1.5rem",
            }}
          >
            Transform Your
            <br />
            Space with{" "}
            <em
              className="text-gradient"
              style={{ fontStyle: "italic", fontWeight: 600 }}
            >
              Smart
            </em>
            <br />
            Furniture
          </h1>

          {/* Description */}
          <p
            className="animate-fade-up delay-200"
            style={{
              fontSize: "1.0625rem",
              color: "var(--fg-secondary)",
              lineHeight: 1.75,
              maxWidth: "34rem",
              marginBottom: "2.5rem",
            }}
          >
            Browse curated quality furniture, visualize pieces in your own
            environment with AR, and make confident purchasing decisions — all
            in one place.
          </p>

          {/* CTA Buttons */}
          <div
            className="animate-fade-up delay-300"
            style={{ display: "flex", flexWrap: "wrap", gap: "0.875rem", marginBottom: "3rem" }}
          >
            <Link
              href="/products"
              className="btn-shimmer"
              style={{
                padding: "0.875rem 2rem",
                fontSize: "0.9375rem",
                fontWeight: 600,
                color: "var(--fg-primary)",
                textDecoration: "none",
                borderRadius: "var(--radius-full)",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              Browse Products
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <a
              href="#about"
              className="btn-ghost"
              style={{
                padding: "0.875rem 2rem",
                fontSize: "0.9375rem",
                fontWeight: 500,
                textDecoration: "none",
                borderRadius: "var(--radius-full)",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "var(--fg-primary)",
              }}
            >
              Explore Features
            </a>
          </div>

          {/* Stats Bar */}
          <div
            className="animate-fade-up delay-400"
            style={{
              display: "flex",
              gap: "2.5rem",
              flexWrap: "wrap",
            }}
          >
            {[
              { value: "2,400+", label: "Products" },
              { value: "98%", label: "Happy Clients" },
              { value: "5★", label: "Avg Rating" },
            ].map((stat) => (
              <div key={stat.label}>
                <div
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.625rem",
                    fontWeight: 700,
                    color: "var(--fg-primary)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: "0.8125rem", color: "var(--fg-muted)", marginTop: "0.25rem" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Visual Panel */}
        <div
          className="animate-scale-in delay-200"
          style={{ position: "relative" }}
        >
          {/* Main image card */}
          <div
            style={{
              background: "var(--bg-elevated)",
              borderRadius: "var(--radius-xl)",
              border: "1px solid var(--border)",
              overflow: "hidden",
              aspectRatio: "4/5",
              position: "relative",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            {/* Gradient placeholder */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(145deg, #F0EBE3 0%, #E8DDD0 40%, #D4C5B0 100%)",
              }}
            />
            {/* Decorative furniture silhouette */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "9rem",
                opacity: 0.18,
              }}
            >
              🛋️
            </div>
            {/* Label overlay */}
            <div
              style={{
                position: "absolute",
                bottom: "1.5rem",
                left: "1.5rem",
                background: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(8px)",
                borderRadius: "var(--radius-md)",
                padding: "0.875rem 1.125rem",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <div style={{ fontSize: "0.75rem", color: "var(--fg-muted)", marginBottom: "0.25rem" }}>
                Featured piece
              </div>
              <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--fg-primary)" }}>
                Modern Lounge Sofa
              </div>
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "var(--accent-dark)",
                  fontWeight: 600,
                  marginTop: "0.25rem",
                }}
              >
                Rs. 45,000
              </div>
            </div>
          </div>

          {/* Floating badge 1 */}
          <div
            className="animate-float"
            style={{
              position: "absolute",
              top: "-1.25rem",
              left: "-2rem",
              background: "var(--bg-surface)",
              borderRadius: "var(--radius-md)",
              padding: "0.75rem 1rem",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-md)",
              display: "flex",
              alignItems: "center",
              gap: "0.625rem",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "var(--radius-sm)",
                background: "rgba(201,169,110,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.25rem",
              }}
            >
              🏠
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--fg-muted)" }}>AR Preview</div>
              <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--fg-primary)" }}>Live</div>
            </div>
          </div>

          {/* Floating badge 2 */}
          <div
            className="animate-float delay-300"
            style={{
              position: "absolute",
              bottom: "3rem",
              right: "-1.75rem",
              background: "var(--bg-dark)",
              color: "var(--fg-inverse)",
              borderRadius: "var(--radius-md)",
              padding: "0.75rem 1.125rem",
              boxShadow: "var(--shadow-lg)",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span style={{ fontSize: "1.125rem" }}>✨</span>
            <div>
              <div style={{ fontSize: "0.75rem", color: "rgba(250,249,247,0.55)" }}>AI Powered</div>
              <div style={{ fontSize: "0.8125rem", fontWeight: 600 }}>Smart Match</div>
            </div>
          </div>

          {/* Decorative corner brackets */}
          {[
            { top: -8, left: -8, borderTop: "2px solid var(--accent)", borderLeft: "2px solid var(--accent)" },
            { top: -8, right: -8, borderTop: "2px solid var(--accent)", borderRight: "2px solid var(--accent)" },
            { bottom: -8, left: -8, borderBottom: "2px solid var(--accent)", borderLeft: "2px solid var(--accent)" },
            { bottom: -8, right: -8, borderBottom: "2px solid var(--accent)", borderRight: "2px solid var(--accent)" },
          ].map((style, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 24,
                height: 24,
                ...style,
              }}
            />
          ))}
        </div>
      </div>

      {/* Responsive layout style */}
      <style>{`
        @media (max-width: 768px) {
          section > div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
