"use client";

import { useState } from "react";

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1.75rem", marginBottom: "1.25rem" }}>
      <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--fg-primary)", marginBottom: "1.25rem", paddingBottom: "0.875rem", borderBottom: "1px solid var(--border)" }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function FormField({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "1.125rem" }}>
      <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "var(--fg-secondary)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
        {label}
      </label>
      {children}
      {hint && <p style={{ marginTop: "0.375rem", fontSize: "0.75rem", color: "var(--fg-muted)" }}>{hint}</p>}
    </div>
  );
}

export default function AdminSettingsPage() {
  const [store, setStore] = useState({
    name: "LIMATA",
    email: "hello@limata.com",
    phone: "+91 98765 43210",
    address: "123 Design Street, Mumbai, Maharashtra 400001",
  });
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div style={{ padding: "2.5rem 2rem", maxWidth: 900 }}>
      <div style={{ marginBottom: "2rem" }}>
        <div className="section-label" style={{ marginBottom: "0.75rem" }}>Storefront</div>
        <h1 className="font-display" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "var(--fg-primary)", letterSpacing: "-0.025em" }}>
          Site Settings
        </h1>
        <p style={{ marginTop: "0.375rem", fontSize: "0.875rem", color: "var(--fg-secondary)" }}>
          Store information and branding used across the website.
        </p>
      </div>

      {/* Store Info */}
      <SectionCard title="Store Information">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <FormField label="Store Name">
            <input className="input-base" value={store.name} onChange={(e) => setStore({ ...store, name: e.target.value })} />
          </FormField>
          <FormField label="Store Email">
            <input className="input-base" type="email" value={store.email} onChange={(e) => setStore({ ...store, email: e.target.value })} />
          </FormField>
          <FormField label="Store Phone">
            <input className="input-base" value={store.phone} onChange={(e) => setStore({ ...store, phone: e.target.value })} />
          </FormField>
        </div>
        <FormField label="Store Address">
          <textarea className="input-base" rows={2} value={store.address} onChange={(e) => setStore({ ...store, address: e.target.value })} style={{ resize: "vertical" }} />
        </FormField>
      </SectionCard>

      {/* Branding */}
      <SectionCard title="Branding">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          <div>
            <FormField label="Logo" hint="Recommended: SVG or PNG, transparent background">
              <div
                style={{
                  border: "2px dashed var(--border-strong)",
                  borderRadius: "var(--radius-md)",
                  padding: "2rem",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "border-color 0.2s ease",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--accent)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--border-strong)")}
              >
                <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem", opacity: 0.4 }}>🖼️</div>
                <p style={{ fontSize: "0.8rem", color: "var(--fg-muted)" }}>Click to upload logo</p>
              </div>
            </FormField>
          </div>
          <div>
            <FormField label="Favicon" hint="Recommended: 32×32px ICO or PNG">
              <div
                style={{
                  border: "2px dashed var(--border-strong)",
                  borderRadius: "var(--radius-md)",
                  padding: "2rem",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "border-color 0.2s ease",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--accent)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--border-strong)")}
              >
                <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem", opacity: 0.4 }}>⭐</div>
                <p style={{ fontSize: "0.8rem", color: "var(--fg-muted)" }}>Click to upload favicon</p>
              </div>
            </FormField>
          </div>
        </div>
      </SectionCard>

      {/* Future placeholder */}
      <div
        style={{
          padding: "1.5rem",
          background: "rgba(201,169,110,0.06)",
          border: "1px solid rgba(201,169,110,0.2)",
          borderRadius: "var(--radius-lg)",
          marginBottom: "1.25rem",
          display: "flex",
          gap: "1rem",
          alignItems: "flex-start",
        }}
      >
        <span style={{ fontSize: "1.25rem", lineHeight: 1 }}>🔮</span>
        <div>
          <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--accent-dark)", marginBottom: "0.25rem" }}>Coming Soon</p>
          <p style={{ fontSize: "0.8rem", color: "var(--fg-secondary)", lineHeight: 1.6 }}>
            SEO settings, custom domain, email templates, and notification preferences will be available here.
          </p>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={handleSave}
          className="btn-shimmer"
          style={{ padding: "0.75rem 2rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--fg-primary)", border: "none", borderRadius: "var(--radius-full)", cursor: "pointer" }}
        >
          {saved ? "✓ Saved" : "Save Settings"}
        </button>
      </div>

      <style>{`
        @media (max-width: 640px) {
          div[style*="repeat(2, 1fr)"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
