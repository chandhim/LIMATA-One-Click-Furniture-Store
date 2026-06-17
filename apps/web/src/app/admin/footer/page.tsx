"use client";

import { useState, useEffect } from "react";
import { useAdminSettings, useUpdateSetting } from "@/features/admin/hooks/use-admin";
import { Info, Link as LinkIcon, Share2, Plus, Trash2, Save } from "lucide-react";

function SectionCard({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>; children: React.ReactNode }) {
  return (
    <div 
      style={{ 
        background: "var(--bg-surface)", 
        border: "1px solid var(--border)", 
        borderRadius: "var(--radius-lg)", 
        padding: "1.75rem", 
        marginBottom: "1.5rem",
        boxShadow: "var(--shadow-sm)"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem", paddingBottom: "0.875rem", borderBottom: "1px solid var(--border)" }}>
        <Icon size={16} style={{ color: "var(--accent)" }} />
        <h3 style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--fg-primary)", margin: 0 }}>
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "var(--fg-secondary)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

export default function AdminFooterPage() {
  const { data: settings = {}, isLoading } = useAdminSettings();
  const updateSettingMutation = useUpdateSetting();

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

  useEffect(() => {
    if (settings.footer_company) {
      setCompany(settings.footer_company);
    }
    if (settings.footer_links) {
      setLinks(settings.footer_links);
    }
    if (settings.footer_social) {
      setSocial(settings.footer_social);
    }
  }, [settings]);

  async function handleSave() {
    try {
      await updateSettingMutation.mutateAsync({ key: "footer_company", value: company });
      await updateSettingMutation.mutateAsync({ key: "footer_links", value: links });
      await updateSettingMutation.mutateAsync({ key: "footer_social", value: social });

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
    }
  }

  function removeLink(id: string) {
    setLinks(links.filter((l) => l.id !== id));
  }

  function addLink() {
    if (!newLink.label || !newLink.href) return;
    setLinks([...links, { id: Date.now().toString(), ...newLink }]);
    setNewLink({ label: "", href: "" });
  }

  if (isLoading) {
    return (
      <div 
        style={{ 
          padding: "4rem", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          minHeight: "80vh", 
          color: "var(--fg-muted)", 
          gap: "0.75rem",
          background: "var(--bg-base)"
        }}
      >
        <div style={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid var(--accent)", borderTopColor: "transparent", animation: "spin 0.7s linear infinite" }} />
        <span>Loading settings...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: "2.5rem 2rem", maxWidth: 1000, margin: "0 auto", background: "var(--bg-base)", minHeight: "100vh" }}>
      
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div className="section-label" style={{ marginBottom: "0.75rem" }}>Storefront</div>
        <h1 className="font-display" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "var(--fg-primary)", letterSpacing: "-0.025em" }}>
          Footer Management
        </h1>
        <p style={{ marginTop: "0.375rem", fontSize: "0.875rem", color: "var(--fg-secondary)" }}>
          Manage company description text, navigation links, and social profile links.
        </p>
      </div>

      {/* Company Info Card */}
      <SectionCard title="Company Information Details" icon={Info}>
        <FormField label="Brand Corporate Name">
          <input className="input-base" value={company.name} onChange={(e) => setCompany({ ...company, name: e.target.value })} />
        </FormField>
        <FormField label="Footer Brand Description text">
          <textarea className="input-base" rows={3} value={company.desc} onChange={(e) => setCompany({ ...company, desc: e.target.value })} style={{ resize: "vertical" }} />
        </FormField>
        <FormField label="Copyright Legal Text">
          <input className="input-base" value={company.copyright} onChange={(e) => setCompany({ ...company, copyright: e.target.value })} />
        </FormField>
      </SectionCard>

      {/* Footer Navigation Links Card */}
      <SectionCard title="Footer Navigation Links" icon={LinkIcon}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
          {links.map((link) => (
            <div
              key={link.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "0.875rem 1.25rem",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--fg-primary)", flex: 1 }}>{link.label}</span>
              <span style={{ fontSize: "0.8rem", color: "var(--fg-muted)", flex: 2, fontFamily: "monospace" }}>{link.href}</span>
              <button
                onClick={() => removeLink(link.id)}
                style={{ 
                  background: "none", 
                  border: "none", 
                  cursor: "pointer", 
                  fontSize: "0.78rem", 
                  fontWeight: 700,
                  color: "var(--fg-muted)", 
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  transition: "color 0.15s ease" 
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#dc2626")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--fg-muted)")}
              >
                <Trash2 size={12} />
                <span>Remove</span>
              </button>
            </div>
          ))}
        </div>

        {/* Add new link form panel */}
        <div 
          style={{ 
            display: "flex", 
            gap: "1rem", 
            alignItems: "flex-end", 
            paddingTop: "1.25rem", 
            borderTop: "1px dashed var(--border)" 
          }}
        >
          <div style={{ flex: 1 }}>
            <FormField label="New Link Label">
              <input className="input-base" placeholder="e.g. Terms of Service" value={newLink.label} onChange={(e) => setNewLink({ ...newLink, label: e.target.value })} style={{ background: "var(--bg-elevated)" }} />
            </FormField>
          </div>
          <div style={{ flex: 2 }}>
            <FormField label="Target Path URL">
              <input className="input-base" placeholder="e.g. /terms" value={newLink.href} onChange={(e) => setNewLink({ ...newLink, href: e.target.value })} style={{ background: "var(--bg-elevated)" }} />
            </FormField>
          </div>
          <div style={{ paddingBottom: "1.25rem" }}>
            <button
              onClick={addLink}
              style={{
                padding: "0.75rem 1.25rem",
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "var(--accent-dark)",
                background: "rgba(201,169,110,0.1)",
                border: "1px solid var(--accent-light)",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
                transition: "all 0.15s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "rgba(201,169,110,0.18)";
                el.style.borderColor = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "rgba(201,169,110,0.1)";
                el.style.borderColor = "var(--accent-light)";
              }}
            >
              <Plus size={14} />
              <span>Add Link</span>
            </button>
          </div>
        </div>
      </SectionCard>

      {/* Social Links Card */}
      <SectionCard title="Social Media Connections" icon={Share2}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
          {(["facebook", "instagram", "linkedin", "tiktok"] as const).map((platform) => (
            <FormField key={platform} label={platform}>
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

      {/* Save Button */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={handleSave}
          disabled={updateSettingMutation.isPending}
          className="btn-shimmer"
          style={{ 
            padding: "0.875rem 2.25rem", 
            fontSize: "0.875rem", 
            fontWeight: 700, 
            color: "var(--fg-primary)", 
            border: "none", 
            borderRadius: "var(--radius-full)", 
            cursor: updateSettingMutation.isPending ? "not-allowed" : "pointer", 
            opacity: updateSettingMutation.isPending ? 0.7 : 1,
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          <Save size={14} />
          <span>{saved ? "✓ Changes Saved" : "Save All Changes"}</span>
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
          div[style*="align-items: flex-end"] { flex-direction: column !important; align-items: stretch !important; gap: 0.75rem !important; }
          div[style*="paddingBottom: 1.25rem"] { padding-bottom: 0 !important; }
        }
      `}</style>
    </div>
  );
}
