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

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "1.125rem" }}>
      <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "var(--fg-secondary)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

export default function AdminFooterPage() {
  const [company, setCompany] = useState({
    name: "LIMATA",
    desc: "Curated quality furniture for modern homes. One-click shopping, AR visualization, and white-glove delivery.",
    copyright: "© 2025 LIMATA. All rights reserved.",
  });

  const [links, setLinks] = useState([
    { id: "1", label: "Home", href: "/" },
    { id: "2", label: "Products", href: "/products" },
    { id: "3", label: "Categories", href: "/#categories" },
    { id: "4", label: "Contact", href: "/contact" },
  ]);

  const [social, setSocial] = useState({
    facebook: "",
    instagram: "",
    linkedin: "",
    tiktok: "",
  });

  const [saved, setSaved] = useState(false);
  const [newLink, setNewLink] = useState({ label: "", href: "" });

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function removeLink(id: string) {
    setLinks(links.filter((l) => l.id !== id));
  }

  function addLink() {
    if (!newLink.label || !newLink.href) return;
    setLinks([...links, { id: Date.now().toString(), ...newLink }]);
    setNewLink({ label: "", href: "" });
  }

  return (
    <div style={{ padding: "2.5rem 2rem", maxWidth: 900 }}>
      <div style={{ marginBottom: "2rem" }}>
        <div className="section-label" style={{ marginBottom: "0.75rem" }}>Storefront</div>
        <h1 className="font-display" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "var(--fg-primary)", letterSpacing: "-0.025em" }}>
          Footer Management
        </h1>
        <p style={{ marginTop: "0.375rem", fontSize: "0.875rem", color: "var(--fg-secondary)" }}>
          Manage company info, navigation links and social media.
        </p>
      </div>

      {/* Company Info */}
      <SectionCard title="Company Information">
        <FormField label="Company Name">
          <input className="input-base" value={company.name} onChange={(e) => setCompany({ ...company, name: e.target.value })} />
        </FormField>
        <FormField label="Description">
          <textarea className="input-base" rows={3} value={company.desc} onChange={(e) => setCompany({ ...company, desc: e.target.value })} style={{ resize: "vertical" }} />
        </FormField>
        <FormField label="Copyright Text">
          <input className="input-base" value={company.copyright} onChange={(e) => setCompany({ ...company, copyright: e.target.value })} />
        </FormField>
      </SectionCard>

      {/* Footer Links */}
      <SectionCard title="Navigation Links">
        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", marginBottom: "1rem" }}>
          {links.map((link) => (
            <div
              key={link.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem 1rem",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--fg-primary)", flex: 1 }}>{link.label}</span>
              <span style={{ fontSize: "0.8rem", color: "var(--fg-muted)", flex: 2 }}>{link.href}</span>
              <button
                onClick={() => removeLink(link.id)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.78rem", color: "var(--fg-muted)", transition: "color 0.15s ease" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#c0392b")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--fg-muted)")}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Add new link */}
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-end" }}>
          <div style={{ flex: 1 }}>
            <FormField label="Link Label">
              <input className="input-base" placeholder="e.g. About Us" value={newLink.label} onChange={(e) => setNewLink({ ...newLink, label: e.target.value })} />
            </FormField>
          </div>
          <div style={{ flex: 2 }}>
            <FormField label="URL / Path">
              <input className="input-base" placeholder="e.g. /about" value={newLink.href} onChange={(e) => setNewLink({ ...newLink, href: e.target.value })} />
            </FormField>
          </div>
          <div style={{ paddingBottom: "1.125rem" }}>
            <button
              onClick={addLink}
              style={{
                padding: "0.875rem 1.25rem",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--accent-dark)",
                background: "rgba(201,169,110,0.1)",
                border: "1px solid var(--accent-light)",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                transition: "all 0.15s ease",
                whiteSpace: "nowrap",
              }}
            >
              + Add Link
            </button>
          </div>
        </div>
      </SectionCard>

      {/* Social Links */}
      <SectionCard title="Social Media Links">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          {(["facebook", "instagram", "linkedin", "tiktok"] as const).map((platform) => (
            <FormField key={platform} label={platform.charAt(0).toUpperCase() + platform.slice(1)}>
              <input
                className="input-base"
                placeholder={`https://${platform}.com/limata`}
                value={social[platform]}
                onChange={(e) => setSocial({ ...social, [platform]: e.target.value })}
              />
            </FormField>
          ))}
        </div>
      </SectionCard>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={handleSave}
          className="btn-shimmer"
          style={{ padding: "0.75rem 2rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--fg-primary)", border: "none", borderRadius: "var(--radius-full)", cursor: "pointer" }}
        >
          {saved ? "✓ Saved" : "Save All Changes"}
        </button>
      </div>
    </div>
  );
}
