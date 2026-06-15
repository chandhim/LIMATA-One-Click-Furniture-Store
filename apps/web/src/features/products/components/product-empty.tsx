"use client";

export function ProductEmpty() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "5rem 2rem",
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
      }}
    >
      <div style={{ fontSize: "3.5rem", marginBottom: "1.25rem", opacity: 0.5 }}>🔍</div>
      <h3
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "1.375rem",
          fontWeight: 600,
          color: "var(--fg-primary)",
          marginBottom: "0.625rem",
          letterSpacing: "-0.01em",
        }}
      >
        No products found
      </h3>
      <p style={{ fontSize: "0.9375rem", color: "var(--fg-secondary)", lineHeight: 1.6, maxWidth: "24rem", margin: "0 auto" }}>
        Try adjusting your search term or clearing the category filter.
      </p>
    </div>
  );
}
