import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", padding: "2rem", textAlign: "center" }}>
      <div style={{ background: "var(--bg-surface)", padding: "1.5rem", borderRadius: "50%", color: "var(--accent)", marginBottom: "1.5rem", boxShadow: "var(--shadow-sm)" }}>
        <Sparkles size={48} />
      </div>
      <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--fg-primary)", marginBottom: "1rem", fontFamily: "var(--font-serif)" }}>
        We couldn&apos;t find that page
      </h2>
      <p style={{ fontSize: "1.1rem", color: "var(--fg-secondary)", maxWidth: "500px", marginBottom: "2rem" }}>
        The page you are looking for might have been moved, deleted, or never existed.
      </p>
      <Link href="/products" className="btn-shimmer" style={{ display: "inline-block", padding: "0.875rem 2rem", borderRadius: "var(--radius-full)", color: "#fff", fontWeight: 600, textDecoration: "none" }}>
        Return to Store
      </Link>
    </div>
  );
}
