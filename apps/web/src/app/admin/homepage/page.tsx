"use client";

import { useState, useEffect } from "react";
import { useAdminSettings, useUpdateSetting } from "@/features/admin/hooks/use-admin";
import { Home, Sparkles, Layers, List, Save } from "lucide-react";

type Tab = "hero" | "features" | "products" | "ai";

const tabs: { id: Tab; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { id: "hero", label: "Hero Banner", icon: Home },
  { id: "features", label: "Highlights Banner", icon: List },
  { id: "products", label: "Featured Collections", icon: Layers },
  { id: "ai", label: "AI & AR Placement", icon: Sparkles },
];

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
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
      <h3
        style={{
          fontSize: "0.875rem",
          fontWeight: 700,
          color: "var(--fg-primary)",
          marginBottom: "1.5rem",
          paddingBottom: "0.875rem",
          borderBottom: "1px solid var(--border)",
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

function FormField({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "var(--fg-secondary)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
        {label}
      </label>
      {children}
      {hint && <p style={{ marginTop: "0.375rem", fontSize: "0.75rem", color: "var(--fg-muted)", margin: 0 }}>{hint}</p>}
    </div>
  );
}

function SaveButton({ onClick, saved, disabled }: { onClick: () => void; saved: boolean; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="btn-shimmer"
      style={{
        padding: "0.75rem 2rem",
        fontSize: "0.875rem",
        fontWeight: 700,
        color: "var(--fg-primary)",
        border: "none",
        borderRadius: "var(--radius-full)",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        opacity: disabled ? 0.7 : 1,
        boxShadow: disabled ? "none" : "var(--shadow-accent)",
        transition: "all 0.2s ease"
      }}
    >
      <Save size={14} />
      <span>{saved ? "✓ Changes Saved" : "Save Changes"}</span>
    </button>
  );
}

export default function AdminHomepagePage() {
  const [activeTab, setActiveTab] = useState<Tab>("hero");
  const { data: settings = {}, isLoading } = useAdminSettings();
  const updateSettingMutation = useUpdateSetting();

  // 1. Hero State
  const [heroForm, setHeroForm] = useState({
    title: "Crafted for the Way You Live.",
    subtitle: "Browse 2,400+ curated quality pieces — visualize them in your space with AR and order in one click.",
    primaryBtn: "Browse Collection",
    secondaryBtn: "Explore Rooms",
  });
  const [heroSaved, setHeroSaved] = useState(false);

  // 2. Features State
  const [featuresList, setFeaturesList] = useState([
    { id: "1", title: "Curated Quality", desc: "Every piece hand-selected by our interior design team." },
    { id: "2", title: "Secure Payments", desc: "End-to-end encrypted checkout on every order." },
    { id: "3", title: "White-Glove Delivery", desc: "Professional assembly and delivery to your door." },
    { id: "4", title: "AR Visualization", desc: "See exactly how any piece looks in your home." },
  ]);
  const [featuresSaved, setFeaturesSaved] = useState(false);

  // 3. AI Features State
  const [aiFeaturesList, setAiFeaturesList] = useState([
    { id: "1", title: "3D Visualization", desc: "Rotate and inspect every detail before you buy.", badge: "Coming Soon" },
    { id: "2", title: "AR Placement", desc: "Drop any piece into your room via your phone camera.", badge: "Beta" },
    { id: "3", title: "AI Style Match", desc: "Tell us your aesthetic — our AI recommends pieces that work together.", badge: "Coming Soon" },
  ]);
  const [aiSaved, setAiSaved] = useState(false);

  // Sync state with settings on load
  useEffect(() => {
    if (settings.homepage_hero) {
      setHeroForm(settings.homepage_hero);
    }
    if (settings.homepage_features) {
      setFeaturesList(settings.homepage_features);
    }
    if (settings.homepage_ai) {
      setAiFeaturesList(settings.homepage_ai);
    }
  }, [settings]);

  // Save Handlers
  async function saveHero() {
    try {
      await updateSettingMutation.mutateAsync({ key: "homepage_hero", value: heroForm });
      setHeroSaved(true);
      setTimeout(() => setHeroSaved(false), 2000);
    } catch (err) {
      console.error(err);
    }
  }

  async function saveFeatures() {
    try {
      await updateSettingMutation.mutateAsync({ key: "homepage_features", value: featuresList });
      setFeaturesSaved(true);
      setTimeout(() => setFeaturesSaved(false), 2000);
    } catch (err) {
      console.error(err);
    }
  }

  async function saveAiFeatures() {
    try {
      await updateSettingMutation.mutateAsync({ key: "homepage_ai", value: aiFeaturesList });
      setAiSaved(true);
      setTimeout(() => setAiSaved(false), 2000);
    } catch (err) {
      console.error(err);
    }
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
        <span>Loading Settings...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const mutating = updateSettingMutation.isPending;

  return (
    <div style={{ padding: "2.5rem 2rem", maxWidth: 1000, margin: "0 auto", background: "var(--bg-base)", minHeight: "100vh" }}>
      
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div className="section-label" style={{ marginBottom: "0.75rem" }}>Storefront</div>
        <h1 className="font-display" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "var(--fg-primary)", letterSpacing: "-0.025em" }}>
          Homepage Content Editor
        </h1>
        <p style={{ marginTop: "0.375rem", fontSize: "0.875rem", color: "var(--fg-secondary)" }}>
          Modify public banner content, highlight lists, and promotional headings.
        </p>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "0.375rem",
          marginBottom: "2rem",
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-xl)",
          padding: "0.375rem",
          flexWrap: "wrap",
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.55rem 1.125rem",
                fontSize: "0.825rem",
                fontWeight: isActive ? 600 : 500,
                color: isActive ? "var(--fg-primary)" : "var(--fg-secondary)",
                background: isActive ? "var(--bg-surface)" : "transparent",
                border: isActive ? "1px solid var(--border)" : "1px solid transparent",
                borderRadius: "var(--radius-lg)",
                cursor: "pointer",
                boxShadow: isActive ? "var(--shadow-sm)" : "none",
                transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = "var(--fg-primary)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = "var(--fg-secondary)";
              }}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab contents */}
      {activeTab === "hero" && (
        <>
          <SectionCard title="Hero Banner Configuration">
            <FormField label="Main Display Headline" hint="Drawn as the main uppercase welcome title.">
              <input className="input-base" value={heroForm.title} onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })} />
            </FormField>
            <FormField label="Subheading Subtext / Promo Summary">
              <textarea className="input-base" rows={3} value={heroForm.subtitle} onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })} style={{ resize: "vertical" }} />
            </FormField>
            <div className="homepage-hero-grid">
              <FormField label="Primary Action Button text">
                <input className="input-base" value={heroForm.primaryBtn} onChange={(e) => setHeroForm({ ...heroForm, primaryBtn: e.target.value })} />
              </FormField>
              <FormField label="Secondary Action Button text">
                <input className="input-base" value={heroForm.secondaryBtn} onChange={(e) => setHeroForm({ ...heroForm, secondaryBtn: e.target.value })} />
              </FormField>
            </div>
          </SectionCard>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <SaveButton onClick={saveHero} saved={heroSaved} disabled={mutating} />
          </div>
        </>
      )}

      {activeTab === "features" && (
        <>
          <SectionCard title="Why LIMATA Highlighting Features">
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {featuresList.map((f, i) => (
                <div
                  key={f.id}
                  style={{
                    padding: "1.25rem",
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--accent-dark)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>
                    Feature Card #{i + 1}
                  </div>
                  <div className="homepage-features-grid" style={{ alignItems: "start" }}>
                    <input
                      className="input-base"
                      value={f.title}
                      placeholder="Highlight label title..."
                      onChange={(e) => {
                        const updated = [...featuresList];
                        updated[i] = { ...f, title: e.target.value };
                        setFeaturesList(updated);
                      }}
                      style={{ background: "var(--bg-surface)" }}
                    />
                    <input
                      className="input-base"
                      value={f.desc}
                      placeholder="Highlight card description text..."
                      onChange={(e) => {
                        const updated = [...featuresList];
                        updated[i] = { ...f, desc: e.target.value };
                        setFeaturesList(updated);
                      }}
                      style={{ background: "var(--bg-surface)" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <SaveButton onClick={saveFeatures} saved={featuresSaved} disabled={mutating} />
          </div>
        </>
      )}

      {activeTab === "products" && (
        <SectionCard title="Featured Products Collection Integration">
          <p style={{ fontSize: "0.875rem", color: "var(--fg-secondary)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
            The storefront Featured Products segment pulls products dynamically from your catalog database. Change product listings in the Catalog configuration tab to modify highlights.
          </p>
          <div 
            style={{ 
              padding: "2.5rem", 
              textAlign: "center", 
              background: "var(--bg-elevated)", 
              borderRadius: "var(--radius-lg)", 
              border: "1px dashed var(--border-strong)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.75rem"
            }}
          >
            <Layers size={28} style={{ color: "var(--fg-muted)", opacity: 0.5 }} />
            <p style={{ fontSize: "0.875rem", color: "var(--fg-primary)", fontWeight: 600, margin: 0 }}>Catalog integration is active</p>
            <p style={{ fontSize: "0.78rem", color: "var(--fg-muted)", margin: 0 }}>Newly created catalog items automatically cycle onto the storefront highlights slide.</p>
          </div>
        </SectionCard>
      )}

      {activeTab === "ai" && (
        <>
          <SectionCard title="Interactive AI Styles & AR Configurator Cards">
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {aiFeaturesList.map((item, i) => (
                <div
                  key={item.id}
                  style={{
                    padding: "1.25rem",
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--accent-dark)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>
                    AI Tool Config #{i + 1}
                  </div>
                  <div className="homepage-ai-grid">
                    <input
                      className="input-base"
                      value={item.title}
                      placeholder="Feature headline title..."
                      onChange={(e) => {
                        const updated = [...aiFeaturesList];
                        updated[i] = { ...item, title: e.target.value };
                        setAiFeaturesList(updated);
                      }}
                      style={{ background: "var(--bg-surface)" }}
                    />
                    <input
                      className="input-base"
                      value={item.desc}
                      placeholder="Feature descriptions details..."
                      onChange={(e) => {
                        const updated = [...aiFeaturesList];
                        updated[i] = { ...item, desc: e.target.value };
                        setAiFeaturesList(updated);
                      }}
                      style={{ background: "var(--bg-surface)" }}
                    />
                    <input
                      className="input-base"
                      value={item.badge}
                      placeholder="Badge label text (e.g. Beta)..."
                      onChange={(e) => {
                        const updated = [...aiFeaturesList];
                        updated[i] = { ...item, badge: e.target.value };
                        setAiFeaturesList(updated);
                      }}
                      style={{ background: "var(--bg-surface)", fontWeight: 600, color: "var(--accent-dark)" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <SaveButton onClick={saveAiFeatures} saved={aiSaved} disabled={mutating} />
          </div>
        </>
      )}
      
      <style>{`
        .homepage-hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }
        .homepage-features-grid {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 1rem;
        }
        .homepage-ai-grid {
          display: grid;
          grid-template-columns: 1.5fr 2.5fr 1fr;
          gap: 1rem;
        }
        @media (max-width: 768px) {
          .homepage-hero-grid,
          .homepage-features-grid,
          .homepage-ai-grid {
            grid-template-columns: 1fr !important;
            gap: 0.75rem !important;
          }
        }
      `}</style>
    </div>
  );
}
