"use client";

const features = [
  {
    title: "Curated Quality",
    desc: "Every piece hand-selected by our interior design team — no compromise on craftsmanship or materials.",
  },
  {
    title: "Secure Payments",
    desc: "End-to-end encrypted checkout. Your data and money are always safe with us.",
  },
  {
    title: "White-Glove Delivery",
    desc: "Professional assembly and delivery straight to your door, on your schedule.",
  },
  {
    title: "AR Visualization",
    desc: "See exactly how any piece looks inside your home before you buy — powered by augmented reality.",
  },
];

export function FeaturesSection() {
  return (
    <section
      id="about"
      style={{
        background: "var(--bg-elevated)",
        padding: "7rem 2rem",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "5rem",
          alignItems: "center",
        }}
      >
        {/* Left: text */}
        <div>
          <div className="section-label animate-fade-up" style={{ marginBottom: "1.25rem" }}>
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
              marginBottom: "3rem",
            }}
          >
            Built around{" "}
            <em style={{ fontStyle: "italic", color: "var(--accent-dark)" }}>
              your
            </em>{" "}
            experience
          </h2>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {features.map((f, i) => (
              <div
                key={f.title}
                className={`animate-fade-up delay-${(i + 1) * 100}`}
                style={{
                  display: "flex",
                  gap: "1.25rem",
                  padding: "1.5rem 0",
                  borderBottom:
                    i < features.length - 1 ? "1px solid var(--border)" : "none",
                  cursor: "default",
                }}
              >
                {/* Dot */}
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "var(--accent)",
                    flexShrink: 0,
                    marginTop: "0.45rem",
                  }}
                />
                <div>
                  <div
                    style={{
                      fontSize: "0.9375rem",
                      fontWeight: 600,
                      color: "var(--fg-primary)",
                      marginBottom: "0.375rem",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {f.title}
                  </div>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--fg-secondary)",
                      lineHeight: 1.7,
                    }}
                  >
                    {f.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: warm visual panel */}
        <div
          className="animate-scale-in delay-200"
          style={{ position: "relative" }}
        >
          {/* Main panel */}
          <div
            style={{
              borderRadius: "var(--radius-xl)",
              overflow: "hidden",
              aspectRatio: "4/5",
              position: "relative",
              background:
                "linear-gradient(145deg, #E8D0B0 0%, #C4966A 40%, #9A6A40 100%)",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            {/* Furniture silhouette */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "10rem",
                opacity: 0.12,
                userSelect: "none",
              }}
            >
              🏠
            </div>

            {/* Gradient overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(10,8,5,0.5) 0%, transparent 60%)",
              }}
            />

            {/* Bottom quote */}
            <div
              style={{
                position: "absolute",
                bottom: "2rem",
                left: "2rem",
                right: "2rem",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontSize: "1.0625rem",
                  color: "rgba(250,249,247,0.9)",
                  lineHeight: 1.6,
                  marginBottom: "0.75rem",
                }}
              >
                "Good design is not about how a product looks, but how it
                makes you feel at home."
              </p>
              <div
                style={{
                  fontSize: "0.72rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(250,249,247,0.45)",
                }}
              >
                — LIMATA Design Team
              </div>
            </div>
          </div>

          {/* Small stat badge */}
          <div
            className="animate-float"
            style={{
              position: "absolute",
              top: "-1rem",
              right: "-1.25rem",
              background: "var(--bg-surface)",
              borderRadius: "var(--radius-md)",
              padding: "0.875rem 1.125rem",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-md)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "var(--fg-primary)",
                lineHeight: 1,
              }}
            >
              2,400+
            </div>
            <div
              style={{
                fontSize: "0.7rem",
                color: "var(--fg-muted)",
                marginTop: "0.25rem",
                letterSpacing: "0.06em",
              }}
            >
              Curated Pieces
            </div>
          </div>
        </div>
      </div>

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
