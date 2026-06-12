"use client";

import Image from "next/image";
import Link from "next/link";

const R2 = "https://pub-cc6bc0ad895f4273912e59614e1effe0.r2.dev";

const categories = [
  {
    name: "Living Room",
    desc: "Sofas, armchairs & tables",
    image: `${R2}/categories/living-room.png`,
    alt: "Modern Scandinavian living room with beige sofa",
  },
  {
    name: "Bedroom",
    desc: "Beds, wardrobes & more",
    image: `${R2}/categories/bedroom.png`,
    alt: "Serene luxury bedroom with upholstered headboard",
  },
  {
    name: "Dining",
    desc: "Tables, chairs & sets",
    image: `${R2}/categories/dining.png`,
    alt: "Stylish modern dining room with walnut table",
  },
  {
    name: "Office",
    desc: "Desks, chairs & storage",
    image: `${R2}/categories/office.png`,
    alt: "Sleek modern home office with standing desk",
  },
  {
    name: "Storage",
    desc: "Shelves, cabinets & racks",
    image: `${R2}/categories/storage.png`,
    alt: "Elegant floor-to-ceiling wooden bookshelves",
  },
];


export function CategoriesSection() {
  return (
    <section
      id="categories"
      style={{
        background: "var(--bg-base)",
        padding: "7rem 0",
        overflow: "hidden",
      }}
    >
      {/* Section header */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 2rem",
          marginBottom: "3.5rem",
        }}
      >
        <div className="section-label animate-fade-up" style={{ marginBottom: "1.125rem" }}>
          Shop by Room
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "1.5rem",
            flexWrap: "wrap",
          }}
        >
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
            Explore Collections
          </h2>
          <Link
            href="/products"
            className="animate-fade-up delay-200"
            style={{
              fontSize: "0.85rem",
              fontWeight: 500,
              color: "var(--fg-secondary)",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              transition: "color 0.2s ease, gap 0.2s ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = "var(--fg-primary)";
              el.style.gap = "0.75rem";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = "var(--fg-secondary)";
              el.style.gap = "0.5rem";
            }}
          >
            View all
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Horizontal photo card strip */}
      <div
        style={{
          display: "flex",
          gap: "1.25rem",
          padding: "0 2rem",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        {categories.map((cat, i) => (
          <Link
            key={cat.name}
            href="/products"
            className={`animate-fade-up delay-${(i + 1) * 100}`}
            style={{
              flexShrink: 0,
              width: "clamp(220px, 22vw, 280px)",
              height: "380px",
              borderRadius: "var(--radius-xl)",
              overflow: "hidden",
              position: "relative",
              scrollSnapAlign: "start",
              textDecoration: "none",
              display: "block",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = "translateY(-6px)";
              el.style.boxShadow = "var(--shadow-lg)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = "translateY(0)";
              el.style.boxShadow = "none";
            }}
          >
            {/* Photorealistic room background image from R2 */}
            <Image
              src={cat.image}
              alt={cat.alt}
              fill
              sizes="(max-width: 768px) 80vw, 280px"
              style={{
                objectFit: "cover",
                objectPosition: "center",
                transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
              }}
            />

            {/* Bottom gradient overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(8,5,3,0.82) 0%, rgba(8,5,3,0.15) 55%, transparent 100%)",
              }}
            />


            {/* Text content */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "1.75rem 1.5rem",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.375rem",
                  fontWeight: 600,
                  color: "#FAF9F7",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.2,
                  marginBottom: "0.375rem",
                }}
              >
                {cat.name}
              </div>
              <div
                style={{
                  fontSize: "0.78rem",
                  color: "rgba(250,249,247,0.6)",
                  marginBottom: "1rem",
                }}
              >
                {cat.desc}
              </div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--accent-light)",
                }}
              >
                Explore
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}
