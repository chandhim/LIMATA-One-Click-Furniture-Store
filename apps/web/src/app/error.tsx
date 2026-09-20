"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application Render Error:", error);
  }, [error]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", padding: "2rem", textAlign: "center" }}>
      <div style={{ background: "rgba(245, 158, 11, 0.1)", padding: "1.5rem", borderRadius: "50%", color: "var(--accent-dark)", marginBottom: "1.5rem" }}>
        <AlertCircle size={48} />
      </div>
      <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--fg-primary)", marginBottom: "1rem", fontFamily: "var(--font-serif)" }}>
        Something went wrong
      </h2>
      <p style={{ fontSize: "1.1rem", color: "var(--fg-secondary)", maxWidth: "500px", marginBottom: "2rem" }}>
        We experienced an unexpected issue. Please try again.
      </p>
      <button 
        onClick={() => reset()} 
        className="btn-shimmer" 
        style={{ padding: "0.875rem 2rem", borderRadius: "var(--radius-full)", color: "#fff", fontWeight: 600, cursor: "pointer", border: "none" }}
      >
        Try Again
      </button>
    </div>
  );
}
