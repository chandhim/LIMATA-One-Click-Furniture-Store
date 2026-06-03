"use client";

const features = [
  {
    icon: "✦",
    title: "Curated Quality",
    desc: "Every piece is hand-selected by our interior design team. No compromise on craftsmanship or material quality.",
    accent: "rgba(201,169,110,0.15)",
    accentText: "var(--accent-dark)",
  },
  {
    icon: "🔒",
    title: "Secure Shopping",
    desc: "End-to-end encrypted payments and full data protection — shop with complete confidence.",
    accent: "rgba(100,180,120,0.15)",
    accentText: "#3a7a50",
  },
  {
    icon: "🚀",
    title: "Fast Delivery",
    desc: "White-glove delivery and professional assembly straight to your door, on your schedule.",
    accent: "rgba(100,130,220,0.15)",
    accentText: "#3a4fa0",
  },
  {
    icon: "⭐",
    title: "Trusted by Thousands",
    desc: "Over 2,400 happy customers with an average 5-star rating across all product categories.",
    accent: "rgba(220,160,80,0.15)",
    accentText: "#8a5f10",
  },
];

export function FeaturesSection() {
  return (
    <section
      id="about"
      style={{
        background: "var(--bg-base)",
        padding: "6rem 1.5rem",
        position: "relative",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Section header */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "1.5rem",
            marginBottom: "3.5rem",
          }}
        >
          <div>
            <div className="section-label animate-fade-up" style={{ marginBottom: "1rem" }}>
              Why LIMATA
            </div>
            <h2
              className="font-display animate-fade-up delay-100"
              style={{
                fontSize: "clamp(2rem, 3.5vw, 2.875rem)",
                fontWeight: 700,
                letterSpacing: "-0.025em",
                color: "var(--fg-primary)",
                lineHeight: 1.15,
              }}
            >
              Built around
              <br />
              <em style={{ fontStyle: "italic", color: "var(--accent-dark)" }}>your</em> experience
            </h2>
          </div>
          <p
            className="animate-fade-up delay-200"
            style={{
              fontSize: "1rem",
              color: "var(--fg-secondary)",
              maxWidth: "28rem",
              lineHeight: 1.75,
            }}
          >
            Simple, reliable, and customer-focused. Every feature we build starts with
            one question: <em>does this make your life easier?</em>
          </p>
        </div>

        {/* Features Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`animate-fade-up delay-${(i + 1) * 100}`}
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                padding: "2rem",
                transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease, border-color 0.3s ease",
                cursor: "default",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(-5px)";
                el.style.boxShadow = "var(--shadow-lg)";
                el.style.borderColor = "var(--accent-light)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "none";
                el.style.borderColor = "var(--border)";
              }}
            >
              {/* Number watermark */}
              <div
                style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1.25rem",
                  fontFamily: "var(--font-serif)",
                  fontSize: "5rem",
                  fontWeight: 700,
                  color: "rgba(28,26,23,0.04)",
                  lineHeight: 1,
                  userSelect: "none",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>

              {/* Icon badge */}
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "var(--radius-md)",
                  background: feature.accent,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.375rem",
                  marginBottom: "1.375rem",
                }}
              >
                {feature.icon}
              </div>

              <h3
                style={{
                  fontSize: "1.0625rem",
                  fontWeight: 600,
                  color: "var(--fg-primary)",
                  marginBottom: "0.625rem",
                  letterSpacing: "-0.01em",
                }}
              >
                {feature.title}
              </h3>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "var(--fg-secondary)",
                  lineHeight: 1.7,
                }}
              >
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
