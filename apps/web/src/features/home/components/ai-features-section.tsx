"use client";

import { usePublicSetting } from "@/features/admin/hooks/use-admin";

const defaultAiFeatures = [
  {
    title: "3D Visualization",
    desc: "Rotate and inspect every detail before you buy. True sense of scale and texture.",
    badge: "Coming Soon",
  },
  {
    title: "AR Placement",
    desc: "Drop any piece into your room via your phone camera. See it live before ordering.",
    badge: "Beta",
  },
  {
    title: "AI Style Match",
    desc: "Tell us your aesthetic — our AI recommends pieces that work together beautifully.",
    badge: "Coming Soon",
  },
];

interface AIFeature {
  title: string;
  desc: string;
  badge: string;
}

export function AIFeaturesSection() {
  const { data: customAiFeatures } = usePublicSetting("homepage_ai");
  const icons = ["🎯", "📱", "✨"];
  const aiFeatures = ((customAiFeatures as AIFeature[]) || defaultAiFeatures).map((f: AIFeature, idx: number) => ({
    ...f,
    icon: icons[idx] || "✨",
  }));
  return (
    <section
      style={{
        background: "var(--bg-dark)",
        padding: "7rem 2rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle warm glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "50rem",
          height: "25rem",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(201,169,110,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          position: "relative",
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "4rem",
          }}
        >
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
              color: "var(--accent)",
              marginBottom: "1.25rem",
            }}
          >
            <span
              style={{
                display: "block",
                width: "1.5rem",
                height: "1px",
                background: "var(--accent)",
              }}
            />
            Future Technology
            <span
              style={{
                display: "block",
                width: "1.5rem",
                height: "1px",
                background: "var(--accent)",
              }}
            />
          </div>
          <h2
            className="font-display animate-fade-up delay-100"
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
            className="animate-fade-up delay-200"
            style={{
              fontSize: "1rem",
              color: "rgba(250,249,247,0.45)",
              maxWidth: "28rem",
              margin: "0 auto",
              lineHeight: 1.75,
            }}
          >
            Practical tools to visualize, match, and place furniture in your
            real space.
          </p>
        </div>

        {/* Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1.5rem",
          }}
        >
          {aiFeatures.map((f, i) => (
            <div
              key={f.title}
              className={`animate-fade-up delay-${(i + 1) * 100}`}
              style={{
                background: "rgba(250,249,247,0.04)",
                border: "1px solid rgba(250,249,247,0.07)",
                borderRadius: "var(--radius-lg)",
                padding: "2.25rem 2rem",
                transition:
                  "transform 0.3s cubic-bezier(0.22,1,0.36,1), border-color 0.3s ease",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(-5px)";
                el.style.borderColor = "rgba(201,169,110,0.3)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(0)";
                el.style.borderColor = "rgba(250,249,247,0.07)";
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "var(--radius-md)",
                  background: "rgba(201,169,110,0.12)",
                  border: "1px solid rgba(201,169,110,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.375rem",
                  marginBottom: "1.5rem",
                }}
              >
                {f.icon}
              </div>

              {/* Badge */}
              <div
                style={{
                  display: "inline-flex",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--accent)",
                  background: "rgba(201,169,110,0.1)",
                  borderRadius: "var(--radius-full)",
                  padding: "0.2rem 0.6rem",
                  marginBottom: "0.875rem",
                }}
              >
                {f.badge}
              </div>

              <h3
                style={{
                  fontSize: "1.0625rem",
                  fontWeight: 600,
                  color: "var(--fg-inverse)",
                  marginBottom: "0.625rem",
                  letterSpacing: "-0.01em",
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "rgba(250,249,247,0.45)",
                  lineHeight: 1.75,
                }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: repeat(3"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
