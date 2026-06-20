"use client";

function Bone({ w, h, r = 8 }: { w: string; h: number; r?: number }) {
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: r,
        background: "linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)",
        backgroundSize: "200% 100%",
        animation: "cartSkeletonShimmer 1.4s infinite linear",
        flexShrink: 0,
      }}
    />
  );
}

function SkeletonItem() {
  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "1.25rem",
        display: "flex",
        gap: "1.25rem",
        alignItems: "center",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <Bone w="96px" h={96} r={12} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        <Bone w="40%" h={12} />
        <Bone w="65%" h={16} />
        <Bone w="30%" h={12} />
        <Bone w="120px" h={40} r={12} />
      </div>
      <Bone w="28px" h={28} r={6} />
    </div>
  );
}

function SkeletonSummary() {
  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "1.75rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <Bone w="60%" h={20} />
      <div style={{ height: 1, background: "var(--border)" }} />
      <Bone w="100%" h={14} />
      <Bone w="100%" h={14} />
      <div style={{ height: 1, background: "var(--border)" }} />
      <Bone w="100%" h={48} r={999} />
    </div>
  );
}

export function CartSkeleton() {
  return (
    <div style={{ background: "var(--bg-base)", minHeight: "100vh" }}>
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "2rem 1.5rem 6rem",
        }}
      >
        {/* Header skeleton */}
        <div style={{ marginBottom: "2.5rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <Bone w="80px" h={12} />
          <Bone w="200px" h={36} />
          <Bone w="140px" h={14} />
        </div>

        {/* Grid skeleton */}
        <div className="cart-grid">
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <SkeletonItem />
            <SkeletonItem />
            <SkeletonItem />
          </div>
          <SkeletonSummary />
        </div>
      </div>

      <style>{`
        @keyframes cartSkeletonShimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .cart-grid {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 2rem;
          align-items: start;
        }
        @media (max-width: 900px) {
          .cart-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
