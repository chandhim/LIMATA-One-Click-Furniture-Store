"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { VisualRecommendPanel } from "@/features/ai/components/visual-recommend-panel";
import { useProducts } from "@/features/products/hooks/use-products";
import { Sparkles, ArrowLeft, Camera, ScanLine, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ShopThisRoomPage() {
  const { data: products } = useProducts();

  return (
    <MainLayout>
      {/* ── Hero Header ───────────────────────────────────────────────── */}
      <div
        style={{
          background: "var(--bg-dark)",
          padding: "4.5rem 1.5rem 5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle dot texture */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, rgba(250,249,247,0.04) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            pointerEvents: "none",
          }}
        />
        {/* Warm glow left */}
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "-5%",
            width: "32rem",
            height: "22rem",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(201,169,110,0.16) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        {/* Warm glow right */}
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            right: "5%",
            width: "24rem",
            height: "18rem",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(201,169,110,0.10) 0%, transparent 70%)",
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
          {/* Breadcrumb / Back Link */}
          <div style={{ marginBottom: "1.25rem" }}>
            <Link
              href="/products"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                color: "rgba(250,249,247,0.6)",
                fontSize: "0.85rem",
                textDecoration: "none",
                fontWeight: 500,
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(250,249,247,0.6)")
              }
            >
              <ArrowLeft size={16} />
              Back to All Products
            </Link>
          </div>

          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--accent)",
              background: "rgba(201,169,110,0.12)",
              padding: "0.3rem 0.85rem",
              borderRadius: "var(--radius-full)",
              marginBottom: "1rem",
            }}
          >
            <Sparkles size={14} color="var(--accent)" />
            AI Room Fit & Visual Recommendations
          </div>

          {/* Title */}
          <h1
            className="font-display"
            style={{
              fontSize: "clamp(2rem, 4vw, 3.25rem)",
              fontWeight: 700,
              color: "var(--fg-inverse)",
              lineHeight: 1.15,
              letterSpacing: "-0.025em",
              marginBottom: "1rem",
            }}
          >
            Shop This Room
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: "1.05rem",
              color: "rgba(250,249,247,0.6)",
              maxWidth: "680px",
              lineHeight: 1.7,
              marginBottom: "2rem",
            }}
          >
            Upload or take a photo of your space. Our AI analyzes your room geometry,
            evaluates existing furniture, and recommends items that fit and complement
            your setup without overcrowding.
          </p>

          {/* 3 Step Process Highlights */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1.25rem",
              maxWidth: "960px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.75rem",
                background: "rgba(250,249,247,0.04)",
                border: "1px solid rgba(250,249,247,0.08)",
                borderRadius: "var(--radius-lg)",
                padding: "1rem 1.25rem",
              }}
            >
              <div
                style={{
                  width: "2rem",
                  height: "2rem",
                  borderRadius: "50%",
                  background: "rgba(201,169,110,0.15)",
                  color: "var(--accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: "0.9rem",
                  fontWeight: 700,
                }}
              >
                1
              </div>
              <div>
                <div style={{ color: "var(--fg-inverse)", fontWeight: 600, fontSize: "0.9rem" }}>
                  Snap or Upload
                </div>
                <div style={{ color: "rgba(250,249,247,0.5)", fontSize: "0.8rem", marginTop: "0.2rem" }}>
                  Take a photo of your living room, bedroom, or office.
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.75rem",
                background: "rgba(250,249,247,0.04)",
                border: "1px solid rgba(250,249,247,0.08)",
                borderRadius: "var(--radius-lg)",
                padding: "1rem 1.25rem",
              }}
            >
              <div
                style={{
                  width: "2rem",
                  height: "2rem",
                  borderRadius: "50%",
                  background: "rgba(201,169,110,0.15)",
                  color: "var(--accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: "0.9rem",
                  fontWeight: 700,
                }}
              >
                2
              </div>
              <div>
                <div style={{ color: "var(--fg-inverse)", fontWeight: 600, fontSize: "0.9rem" }}>
                  AI Spatial Analysis
                </div>
                <div style={{ color: "rgba(250,249,247,0.5)", fontSize: "0.8rem", marginTop: "0.2rem" }}>
                  Detects existing pieces and estimates depth & space.
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.75rem",
                background: "rgba(250,249,247,0.04)",
                border: "1px solid rgba(250,249,247,0.08)",
                borderRadius: "var(--radius-lg)",
                padding: "1rem 1.25rem",
              }}
            >
              <div
                style={{
                  width: "2rem",
                  height: "2rem",
                  borderRadius: "50%",
                  background: "rgba(201,169,110,0.15)",
                  color: "var(--accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: "0.9rem",
                  fontWeight: 700,
                }}
              >
                3
              </div>
              <div>
                <div style={{ color: "var(--fg-inverse)", fontWeight: 600, fontSize: "0.9rem" }}>
                  Perfect Match
                </div>
                <div style={{ color: "rgba(250,249,247,0.5)", fontSize: "0.8rem", marginTop: "0.2rem" }}>
                  Curates furniture matched in size, style, and room context.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content Area ─────────────────────────────────────────── */}
      <div
        style={{
          background: "var(--bg-base)",
          minHeight: "60vh",
          padding: "3rem 1.5rem 6rem",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
          }}
        >
          {/* Visual Recommendation Panel */}
          <VisualRecommendPanel allProducts={products || []} />
        </div>
      </div>
    </MainLayout>
  );
}
