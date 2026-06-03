"use client";

const aiFeatures = [
  {
    number: "01",
    icon: "🎯",
    title: "3D Product Visualization",
    desc: "Rotate, zoom, and inspect every detail of our furniture in full 3D — before you buy. Get a true sense of scale, texture, and finish.",
    badge: "Coming Soon",
  },
  {
    number: "02",
    icon: "📱",
    title: "AR Furniture Placement",
    desc: "Point your phone camera at any room and drop furniture into the scene. See exactly how that sofa looks in your living room.",
    badge: "Beta",
  },
  {
    number: "03",
    icon: "✨",
    title: "AI Style Guidance",
    desc: "Tell us your aesthetic and our AI recommends pieces that work together — color, scale, and proportion all considered.",
    badge: "Coming Soon",
  },
];

export function AIFeaturesSection() {
  return (
    <section
      style={{
        background: "var(--bg-dark)",
        padding: "6rem 1.5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative blobs */}
      <div
        style={{
          position: "absolute",
          top: "-8rem",
          left: "-8rem",
          width: "40rem",
          height: "40rem",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,169,110,0.08) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-6rem",
          right: "-6rem",
          width: "30rem",
          height: "30rem",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative" }}>
        {/* Section header */}
        <div style={{ marginBottom: "3.5rem", textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: "1.25rem",
            }}
          >
            <span style={{ display: "block", width: "1.5rem", height: "1.5px", background: "var(--accent)" }} />
            Future Technology
            <span style={{ display: "block", width: "1.5rem", height: "1.5px", background: "var(--accent)" }} />
          </div>
          <h2
            className="font-display animate-fade-up"
            style={{
              fontSize: "clamp(2rem, 3.5vw, 2.875rem)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              color: "var(--fg-inverse)",
              lineHeight: 1.15,
              marginBottom: "1rem",
            }}
          >
            AI & AR Features
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: "rgba(250,249,247,0.55)",
              maxWidth: "30rem",
              margin: "0 auto",
              lineHeight: 1.75,
            }}
          >
            Practical tools to help you visualize, match, and place furniture in your
            real space — powered by modern AI and augmented reality.
          </p>
        </div>

        {/* Feature Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {aiFeatures.map((feature, i) => (
            <div
              key={feature.title}
              className={`animate-fade-up delay-${(i + 1) * 100}`}
              style={{
                background: "rgba(250,249,247,0.04)",
                border: "1px solid rgba(250,249,247,0.08)",
                borderRadius: "var(--radius-lg)",
                padding: "2rem",
                transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1), border-color 0.3s ease, background 0.3s ease",
                cursor: "default",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(-5px)";
                el.style.borderColor = "rgba(201,169,110,0.4)";
                el.style.background = "rgba(250,249,247,0.07)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(0)";
                el.style.borderColor = "rgba(250,249,247,0.08)";
                el.style.background = "rgba(250,249,247,0.04)";
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
                  color: "rgba(250,249,247,0.04)",
                  lineHeight: 1,
                  userSelect: "none",
                }}
              >
                {feature.number}
              </div>

              {/* Icon */}
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "var(--radius-md)",
                  background: "rgba(201,169,110,0.15)",
                  border: "1px solid rgba(201,169,110,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                {feature.icon}
              </div>

              {/* Badge */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--accent)",
                  background: "rgba(201,169,110,0.12)",
                  borderRadius: "var(--radius-full)",
                  padding: "0.25rem 0.625rem",
                  marginBottom: "0.875rem",
                }}
              >
                {feature.badge}
              </div>

              <h3
                style={{
                  fontSize: "1.0625rem",
                  fontWeight: 600,
                  color: "var(--fg-inverse)",
                  marginBottom: "0.75rem",
                  letterSpacing: "-0.01em",
                }}
              >
                {feature.title}
              </h3>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "rgba(250,249,247,0.55)",
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
