"use client";

import { ChevronRight } from "lucide-react";

export function ProductDetailsSkeleton() {
  return (
    <div style={{ background: "var(--bg-base)", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1.5rem 6rem" }}>
        
        {/* Breadcrumb Skeleton */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "2.5rem",
          }}
        >
          <div className="skeleton-item" style={{ height: "0.875rem", width: "4rem", borderRadius: "var(--radius-sm)" }} />
          <ChevronRight size={14} style={{ opacity: 0.15 }} />
          <div className="skeleton-item" style={{ height: "0.875rem", width: "5rem", borderRadius: "var(--radius-sm)" }} />
          <ChevronRight size={14} style={{ opacity: 0.15 }} />
          <div className="skeleton-item" style={{ height: "0.875rem", width: "8rem", borderRadius: "var(--radius-sm)" }} />
        </div>

        {/* Two-Column Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "3.5rem" }} className="details-grid-skeleton">
          
          {/* Column 1: Gallery & Visual Placeholders */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            
            {/* Gallery Wrapper */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Main Image Frame */}
              <div
                className="skeleton-item"
                style={{
                  width: "100%",
                  aspectRatio: "4/3",
                  borderRadius: "var(--radius-lg)",
                }}
              />
              {/* Thumbnails */}
              <div style={{ display: "flex", gap: "0.75rem" }}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="skeleton-item"
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "var(--radius-md)",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Spatial Visualization Placeholder */}
            <div
              className="skeleton-item"
              style={{
                height: "160px",
                borderRadius: "var(--radius-lg)",
              }}
            />
          </div>

          {/* Column 2: Information & Buy area */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            
            <div>
              {/* Category */}
              <div className="skeleton-item" style={{ height: "0.875rem", width: "6rem", borderRadius: "var(--radius-sm)", marginBottom: "0.75rem" }} />
              
              {/* Title */}
              <div className="skeleton-item" style={{ height: "2.25rem", width: "85%", borderRadius: "var(--radius-md)", marginBottom: "1rem" }} />
              
              {/* Price */}
              <div className="skeleton-item" style={{ height: "1.75rem", width: "40%", borderRadius: "var(--radius-sm)", marginBottom: "1.5rem" }} />
              
              {/* Description lines */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", marginBottom: "2rem" }}>
                <div className="skeleton-item" style={{ height: "0.875rem", width: "100%", borderRadius: "var(--radius-sm)" }} />
                <div className="skeleton-item" style={{ height: "0.875rem", width: "95%", borderRadius: "var(--radius-sm)" }} />
                <div className="skeleton-item" style={{ height: "0.875rem", width: "80%", borderRadius: "var(--radius-sm)" }} />
              </div>
            </div>

            {/* Divider */}
            <div style={{ width: "100%", height: 1, background: "var(--border)", opacity: 0.5 }} />

            {/* Action Bar Skeletons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "1.5rem", flexWrap: "wrap" }}>
                {/* Quantity */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <div className="skeleton-item" style={{ height: "0.75rem", width: "4rem", borderRadius: "var(--radius-sm)" }} />
                  <div className="skeleton-item" style={{ height: "44px", width: "110px", borderRadius: "var(--radius-md)" }} />
                </div>
                {/* Add to Cart Button & Wishlist */}
                <div style={{ display: "flex", gap: "0.75rem", flex: 1, minWidth: "240px" }}>
                  <div className="skeleton-item" style={{ flex: 1, height: "44px", borderRadius: "var(--radius-full)" }} />
                  <div className="skeleton-item" style={{ width: "44px", height: "44px", borderRadius: "50%" }} />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div style={{ width: "100%", height: 1, background: "var(--border)", opacity: 0.5 }} />

            {/* Value badges skeleton */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <div className="skeleton-item" style={{ width: "36px", height: "36px", borderRadius: "var(--radius-md)" }} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <div className="skeleton-item" style={{ height: "0.75rem", width: "60%", borderRadius: "var(--radius-sm)" }} />
                  <div className="skeleton-item" style={{ height: "0.625rem", width: "45%", borderRadius: "var(--radius-sm)" }} />
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <div className="skeleton-item" style={{ width: "36px", height: "36px", borderRadius: "var(--radius-md)" }} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <div className="skeleton-item" style={{ height: "0.75rem", width: "60%", borderRadius: "var(--radius-sm)" }} />
                  <div className="skeleton-item" style={{ height: "0.625rem", width: "45%", borderRadius: "var(--radius-sm)" }} />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Highlights skeleton */}
        <section style={{ marginTop: "5rem", borderTop: "1px solid var(--border)", paddingTop: "4rem" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", marginBottom: "2.5rem" }}>
            <div className="skeleton-item" style={{ height: "0.75rem", width: "6rem", borderRadius: "var(--radius-sm)" }} />
            <div className="skeleton-item" style={{ height: "1.5rem", width: "16rem", borderRadius: "var(--radius-sm)" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)",
                  padding: "1.75rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <div className="skeleton-item" style={{ width: "24px", height: "24px", borderRadius: "var(--radius-sm)" }} />
                <div className="skeleton-item" style={{ height: "1rem", width: "60%", borderRadius: "var(--radius-sm)" }} />
                <div className="skeleton-item" style={{ height: "0.75rem", width: "100%", borderRadius: "var(--radius-sm)" }} />
                <div className="skeleton-item" style={{ height: "0.75rem", width: "85%", borderRadius: "var(--radius-sm)" }} />
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* Shimmer animations */}
      <style>{`
        .skeleton-item {
          background: linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%);
          background-size: 200% 100%;
          animation: skeletonShimmer 1.5s infinite ease-in-out;
        }
        @keyframes skeletonShimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .details-grid-skeleton {
          grid-template-columns: 1.1fr 0.9fr !important;
        }
        @media (max-width: 900px) {
          .details-grid-skeleton {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}
