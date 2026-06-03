"use client";

export function ProductSkeleton() {
  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
      }}
    >
      {/* Image area skeleton */}
      <div
        style={{
          height: "13rem",
          background: "linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)",
          backgroundSize: "200% 100%",
          animation: "skeletonShimmer 1.5s infinite ease-in-out",
        }}
      />

      <div style={{ padding: "1.125rem 1.25rem 1.375rem" }}>
        {/* Badge skeleton */}
        <div
          style={{
            height: "1.25rem",
            width: "5rem",
            borderRadius: "var(--radius-full)",
            background: "linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)",
            backgroundSize: "200% 100%",
            marginBottom: "0.75rem",
            animation: "skeletonShimmer 1.5s infinite ease-in-out",
          }}
        />
        {/* Title skeleton */}
        <div
          style={{
            height: "1rem",
            width: "80%",
            borderRadius: "var(--radius-sm)",
            background: "linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)",
            backgroundSize: "200% 100%",
            animation: "skeletonShimmer 1.5s infinite ease-in-out",
            marginBottom: "0.75rem",
          }}
        />
        {/* Price + icon row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div
            style={{
              height: "1.25rem",
              width: "45%",
              borderRadius: "var(--radius-sm)",
              background: "linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)",
              backgroundSize: "200% 100%",
              animation: "skeletonShimmer 1.5s 0.15s infinite ease-in-out",
            }}
          />
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)",
              backgroundSize: "200% 100%",
              animation: "skeletonShimmer 1.5s 0.3s infinite ease-in-out",
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes skeletonShimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
