"use client";

import Image from "next/image";
import Link from "next/link";

import { usePublicCategories } from "@/features/admin/hooks/use-admin";

interface StorefrontCategory {
  name: string;
  desc: string;
  image: string;
  alt: string;
}

export function CategoriesSection() {
  const { data: dbCategories } = usePublicCategories();
  const categories: StorefrontCategory[] = dbCategories || [];

  if (categories.length === 0) {
    return null;
  }
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
        <div
          className="section-label animate-fade-up"
          style={{ marginBottom: "1.125rem" }}
        >
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
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
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
        {categories.map((cat: StorefrontCategory, i: number) => (
          <Link
            key={cat.name}
            href={`/products?category=${encodeURIComponent(cat.name)}`}
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
              src={cat.image || "/images/hero.svg"}
              alt={cat.alt || "Category"}
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
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
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
