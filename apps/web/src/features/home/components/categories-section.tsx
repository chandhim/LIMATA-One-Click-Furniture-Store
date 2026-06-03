"use client";

const categories = [
  { name: "Living Room", emoji: "🛋️", desc: "Sofas, armchairs & tables", bg: "linear-gradient(135deg, #F5EFE6 0%, #EDE0CC 100%)" },
  { name: "Bedroom",     emoji: "🛏️", desc: "Beds, wardrobes & more",   bg: "linear-gradient(135deg, #EEF0F5 0%, #DDE1ED 100%)" },
  { name: "Dining",      emoji: "🍽️", desc: "Tables, chairs & sets",    bg: "linear-gradient(135deg, #EFF5EE 0%, #DDECD9 100%)" },
  { name: "Office",      emoji: "💼", desc: "Desks, chairs & storage",  bg: "linear-gradient(135deg, #F5F0EE 0%, #EDE0DC 100%)" },
  { name: "Storage",     emoji: "📦", desc: "Shelves, cabinets & racks",bg: "linear-gradient(135deg, #F2EEF5 0%, #E2D9ED 100%)" },
];

export function CategoriesSection() {
  return (
    <section
      id="categories"
      style={{
        background: "var(--bg-elevated)",
        padding: "6rem 1.5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle top border */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: "var(--border)",
        }}
      />

      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Section header */}
        <div style={{ marginBottom: "3.5rem" }}>
          <div className="section-label animate-fade-up" style={{ marginBottom: "1rem" }}>
            Shop by Room
          </div>
          <h2
            className="font-display animate-fade-up delay-100"
            style={{
              fontSize: "clamp(2rem, 3.5vw, 2.875rem)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              color: "var(--fg-primary)",
              lineHeight: 1.15,
              maxWidth: "28rem",
            }}
          >
            Featured Categories
          </h2>
          <p
            className="animate-fade-up delay-200"
            style={{
              marginTop: "0.75rem",
              fontSize: "1rem",
              color: "var(--fg-secondary)",
              maxWidth: "26rem",
            }}
          >
            Find the perfect pieces for every room in your home.
          </p>
        </div>

        {/* Category Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {categories.map((cat, i) => (
            <div
              key={cat.name}
              className={`card animate-fade-up delay-${(i + 1) * 100}`}
              style={{
                cursor: "pointer",
                overflow: "hidden",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "var(--accent-light)";
                el.style.transform = "translateY(-6px)";
                el.style.boxShadow = "var(--shadow-lg)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "var(--border)";
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "var(--shadow-sm)";
              }}
            >
              {/* Image / Emoji area */}
              <div
                style={{
                  height: "11rem",
                  background: cat.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "3.5rem",
                  position: "relative",
                  transition: "font-size 0.3s ease",
                }}
              >
                {cat.emoji}
                {/* Subtle inner shadow */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "40%",
                    background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.4))",
                    pointerEvents: "none",
                  }}
                />
              </div>

              {/* Label */}
              <div style={{ padding: "1.125rem 1.25rem 1.25rem" }}>
                <div
                  style={{
                    fontSize: "0.9375rem",
                    fontWeight: 600,
                    color: "var(--fg-primary)",
                    marginBottom: "0.25rem",
                  }}
                >
                  {cat.name}
                </div>
                <div style={{ fontSize: "0.8125rem", color: "var(--fg-muted)" }}>
                  {cat.desc}
                </div>
                <div
                  style={{
                    marginTop: "0.875rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.375rem",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: "var(--accent-dark)",
                  }}
                >
                  Explore
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
