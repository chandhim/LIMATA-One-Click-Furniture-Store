"use client";

import Image from "next/image";
import Link from "next/link";

import { usePublicSetting } from "@/features/admin/hooks/use-admin";

const HERO_IMAGE_URL =
  "https://pub-cc6bc0ad895f4273912e59614e1effe0.r2.dev/banners/hero-banner.png";

export function HeroSection() {
  const { data: heroData } = usePublicSetting("homepage_hero");

  const title = heroData?.title ?? "Crafted for the Way You Live.";
  const subtitle = heroData?.subtitle ?? "Browse 2,400+ curated quality pieces — visualize them in your space with AR and order in one click.";
  const primaryBtn = heroData?.primaryBtn ?? "Browse Collection";
  const secondaryBtn = heroData?.secondaryBtn ?? "Explore Rooms";

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "flex-end",
        overflow: "hidden",
      }}
    >
      {/* Real photorealistic hero background image from R2 */}
      <Image
        src={HERO_IMAGE_URL}
        alt="Luxury furniture showroom — warm modern living room"
        fill
        priority
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition: "center" }}
      />

      {/* Bottom gradient overlay — makes text readable */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(10,7,3,0.88) 0%, rgba(10,7,3,0.50) 40%, rgba(10,7,3,0.10) 70%, transparent 100%)",
        }}
      />

      {/* Left-side vignette for depth */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right, rgba(10,7,3,0.35) 0%, transparent 55%)",
        }}
      />

      {/* Content — anchored bottom-left */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 2rem 4.5rem",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          alignItems: "flex-end",
          gap: "3rem",
        }}
      >
        {/* Left: headline + CTA */}
        <div>
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
              color: "var(--accent-light)",
              marginBottom: "1.5rem",
            }}
          >
            <span
              style={{
                display: "block",
                width: "1.75rem",
                height: "1px",
                background: "var(--accent)",
              }}
            />
            One-Click Furniture Store
          </div>

          {/* Headline */}
          <h1
            className="font-display animate-fade-up delay-100"
            style={{
              fontSize: "clamp(2.75rem, 5vw, 4.2rem)",
              fontWeight: 700,
              lineHeight: 1.06,
              letterSpacing: "-0.03em",
              color: "#FAF9F7",
              marginBottom: "1.375rem",
            }}
          >
            {title}
          </h1>

          {/* Subtext */}
          <p
            className="animate-fade-up delay-200"
            style={{
              fontSize: "1rem",
              color: "rgba(250,249,247,0.65)",
              lineHeight: 1.75,
              maxWidth: "30rem",
              marginBottom: "2.25rem",
            }}
          >
            {subtitle}
          </p>

          {/* CTAs */}
          <div
            className="animate-fade-up delay-300"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.875rem",
              marginBottom: "2.75rem",
            }}
          >
            <Link
              href="/products"
              className="btn-shimmer"
              style={{
                padding: "0.9rem 2.25rem",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "var(--fg-primary)",
                textDecoration: "none",
                borderRadius: "var(--radius-full)",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                letterSpacing: "0.01em",
              }}
            >
              {primaryBtn}
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
            <a
              href="#categories"
              style={{
                padding: "0.9rem 2.25rem",
                fontSize: "0.9rem",
                fontWeight: 500,
                color: "rgba(250,249,247,0.85)",
                textDecoration: "none",
                borderRadius: "var(--radius-full)",
                border: "1px solid rgba(250,249,247,0.25)",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                transition: "border-color 0.2s ease, color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(250,249,247,0.55)";
                el.style.color = "#FAF9F7";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(250,249,247,0.25)";
                el.style.color = "rgba(250,249,247,0.85)";
              }}
            >
              {secondaryBtn}
            </a>
          </div>

          {/* Stats */}
          <div
            className="animate-fade-up delay-400"
            style={{
              display: "flex",
              gap: "0",
              alignItems: "center",
            }}
          >
            {[
              { value: "2,400+", label: "Pieces" },
              { value: "98%", label: "Happy Clients" },
              { value: "5★", label: "Avg Rating" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                style={{
                  paddingRight: "1.5rem",
                  marginRight: "1.5rem",
                  borderRight:
                    i < 2 ? "1px solid rgba(250,249,247,0.15)" : "none",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.375rem",
                    fontWeight: 700,
                    color: "#FAF9F7",
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: "0.72rem",
                    color: "rgba(250,249,247,0.5)",
                    marginTop: "0.25rem",
                    letterSpacing: "0.05em",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: minimal floating product card */}
        <div
          className="animate-fade-up delay-300"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.10)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: "var(--radius-lg)",
              padding: "1.25rem 1.5rem",
              minWidth: "220px",
            }}
          >
            <div
              style={{
                fontSize: "0.68rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(250,249,247,0.5)",
                marginBottom: "0.5rem",
              }}
            >
              Featured Piece
            </div>
            <div
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.125rem",
                fontWeight: 600,
                color: "#FAF9F7",
                marginBottom: "0.375rem",
                lineHeight: 1.3,
              }}
            >
              Modern Lounge Sofa
            </div>
            <div
              style={{
                fontSize: "0.875rem",
                color: "var(--accent-light)",
                fontWeight: 600,
              }}
            >
              Rs. 45,000
            </div>
            <Link
              href="/products/1"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.375rem",
                marginTop: "1rem",
                fontSize: "0.78rem",
                fontWeight: 500,
                color: "rgba(250,249,247,0.7)",
                textDecoration: "none",
                letterSpacing: "0.04em",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color = "#FAF9F7")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color =
                  "rgba(250,249,247,0.7)")
              }
            >
              View product
              <svg
                width="12"
                height="12"
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
      </div>

      {/* Scroll indicator */}
      <div
        className="animate-fade-up delay-500"
        style={{
          position: "absolute",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
          opacity: 0.4,
        }}
      >
        <div
          style={{
            fontSize: "0.65rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#FAF9F7",
          }}
        >
          Scroll
        </div>
        <div
          style={{
            width: "1px",
            height: "2.5rem",
            background:
              "linear-gradient(to bottom, rgba(250,249,247,0.6), transparent)",
          }}
        />
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 768px) {
          section > div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
            padding-bottom: 3rem !important;
          }
          section > div[style*="grid-template-columns"] > div:last-child {
            justify-content: flex-start !important;
          }
        }
      `}</style>
    </section>
  );
}
