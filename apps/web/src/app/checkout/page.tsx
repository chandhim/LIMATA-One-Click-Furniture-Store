import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout — LIMATA",
  description: "Secure checkout coming soon to LIMATA.",
};

export default function CheckoutPage() {
  return (
    <div
      style={{
        background: "var(--bg-base)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1.5rem",
      }}
    >
      <div
        style={{
          maxWidth: "480px",
          width: "100%",
          textAlign: "center",
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "rgba(201,169,110,0.1)",
            border: "1.5px dashed var(--accent-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 2rem",
            fontSize: "2rem",
          }}
        >
          🛍️
        </div>

        {/* Label */}
        <div className="section-label" style={{ justifyContent: "center", marginBottom: "0.75rem" }}>
          Coming Soon
        </div>

        <h1
          className="font-display"
          style={{
            fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
            fontWeight: 700,
            color: "var(--fg-primary)",
            letterSpacing: "-0.02em",
            marginBottom: "1rem",
          }}
        >
          Checkout Coming Soon
        </h1>

        <p
          style={{
            fontSize: "0.9375rem",
            color: "var(--fg-secondary)",
            lineHeight: 1.7,
            marginBottom: "2.5rem",
          }}
        >
          We&apos;re finalising our secure payment experience. Your cart items
          are saved — come back soon to complete your order.
        </p>

        <div
          style={{
            display: "flex",
            gap: "0.875rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/cart"
            style={{
              padding: "0.75rem 1.75rem",
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "var(--fg-primary)",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-strong)",
              borderRadius: "var(--radius-full)",
              textDecoration: "none",
              transition: "all 0.2s ease",
            }}
          >
            ← Back to Cart
          </Link>

          <Link
            href="/products"
            className="btn-shimmer"
            style={{
              padding: "0.75rem 1.75rem",
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "var(--fg-primary)",
              textDecoration: "none",
              borderRadius: "var(--radius-full)",
              display: "inline-block",
            }}
          >
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
