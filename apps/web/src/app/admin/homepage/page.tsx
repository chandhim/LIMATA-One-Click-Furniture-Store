"use client";

import { useState } from "react";

type Tab = "hero" | "categories" | "features" | "products" | "ai";

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: "hero", label: "Hero Section", icon: "⌂" },
  { id: "categories", label: "Categories", icon: "▤" },
  { id: "features", label: "Why LIMATA", icon: "✦" },
  { id: "products", label: "Featured Products", icon: "◻" },
  { id: "ai", label: "AI Features", icon: "✨" },
];

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "1.75rem",
        marginBottom: "1.25rem",
      }}
    >
      <h3
        style={{
          fontSize: "0.875rem",
          fontWeight: 600,
          color: "var(--fg-primary)",
          marginBottom: "1.25rem",
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
    <div style={{ marginBottom: "1.125rem" }}>
      <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "var(--fg-secondary)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
        {label}
      </label>
      {children}
      {hint && <p style={{ marginTop: "0.375rem", fontSize: "0.75rem", color: "var(--fg-muted)" }}>{hint}</p>}
    </div>
  );
}

function SaveButton({ onClick, saved }: { onClick: () => void; saved: boolean }) {
  return (
    <button
      onClick={onClick}
      className="btn-shimmer"
      style={{
        padding: "0.625rem 1.5rem",
        fontSize: "0.875rem",
        fontWeight: 600,
        color: "var(--fg-primary)",
        border: "none",
        borderRadius: "var(--radius-full)",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.375rem",
      }}
    >
      {saved ? "✓ Saved" : "Save Changes"}
    </button>
  );
}

function HeroEditor() {
  const [form, setForm] = useState({
    title: "Crafted for the Way You Live.",
    subtitle: "Browse 2,400+ curated quality pieces — visualize them in your space with AR and order in one click.",
    primaryBtn: "Browse Collection",
    secondaryBtn: "Explore Rooms",
  });
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <>
      <SectionCard title="Hero Text">
        <FormField label="Main Heading" hint="Displayed as the large hero headline.">
          <input className="input-base" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </FormField>
        <FormField label="Subheading / Description">
          <textarea className="input-base" rows={3} value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} style={{ resize: "vertical" }} />
        </FormField>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <FormField label="Primary Button Text">
            <input className="input-base" value={form.primaryBtn} onChange={(e) => setForm({ ...form, primaryBtn: e.target.value })} />
          </FormField>
          <FormField label="Secondary Button Text">
            <input className="input-base" value={form.secondaryBtn} onChange={(e) => setForm({ ...form, secondaryBtn: e.target.value })} />
          </FormField>
        </div>
      </SectionCard>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <SaveButton onClick={handleSave} saved={saved} />
      </div>
    </>
  );
}

function CategoriesEditor() {
  const [categories, setCategories] = useState([
    { id: "1", name: "Living Room", desc: "Sofas, armchairs & tables" },
    { id: "2", name: "Bedroom", desc: "Beds, wardrobes & more" },
    { id: "3", name: "Dining", desc: "Tables, chairs & sets" },
    { id: "4", name: "Office", desc: "Desks, chairs & storage" },
    { id: "5", name: "Storage", desc: "Shelves, cabinets & racks" },
  ]);

  function removeCategory(id: string) {
    setCategories(categories.filter((c) => c.id !== id));
  }

  return (
    <SectionCard title="Featured Categories">
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.25rem" }}>
        {categories.map((cat) => (
          <div
            key={cat.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "0.875rem 1rem",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--fg-primary)" }}>{cat.name}</div>
              <div style={{ fontSize: "0.78rem", color: "var(--fg-muted)" }}>{cat.desc}</div>
            </div>
            <button
              onClick={() => removeCategory(cat.id)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "0.78rem",
                color: "var(--fg-muted)",
                padding: "0.25rem 0.5rem",
                borderRadius: "4px",
                transition: "color 0.15s ease",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#c0392b")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--fg-muted)")}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <p style={{ fontSize: "0.8rem", color: "var(--fg-muted)", fontStyle: "italic" }}>
        Full category management is available in the Categories section.
      </p>
    </SectionCard>
  );
}

function FeaturesEditor() {
  const [features, setFeatures] = useState([
    { id: "1", title: "Curated Quality", desc: "Every piece hand-selected by our interior design team." },
    { id: "2", title: "Secure Payments", desc: "End-to-end encrypted checkout on every order." },
    { id: "3", title: "White-Glove Delivery", desc: "Professional assembly and delivery to your door." },
    { id: "4", title: "AR Visualization", desc: "See exactly how any piece looks in your home." },
  ]);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <>
      <SectionCard title="Why LIMATA — Feature Cards">
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {features.map((f, i) => (
            <div
              key={f.id}
              style={{
                padding: "1rem",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "0.875rem", alignItems: "start" }}>
                <input
                  className="input-base"
                  value={f.title}
                  placeholder="Feature title"
                  onChange={(e) => {
                    const updated = [...features];
                    updated[i] = { ...f, title: e.target.value };
                    setFeatures(updated);
                  }}
                />
                <input
                  className="input-base"
                  value={f.desc}
                  placeholder="Feature description"
                  onChange={(e) => {
                    const updated = [...features];
                    updated[i] = { ...f, desc: e.target.value };
                    setFeatures(updated);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <SaveButton onClick={handleSave} saved={saved} />
      </div>
    </>
  );
}

function FeaturedProductsEditor() {
  return (
    <SectionCard title="Featured Products">
      <p style={{ fontSize: "0.875rem", color: "var(--fg-secondary)", lineHeight: 1.7, marginBottom: "1rem" }}>
        Toggle which products appear on the homepage. Go to{" "}
        <a href="/admin/products" style={{ color: "var(--accent-dark)", textDecoration: "none" }}>
          Product Management
        </a>{" "}
        and enable the &quot;Show on Homepage&quot; toggle per product.
      </p>
      <div style={{ padding: "2rem", textAlign: "center", background: "var(--bg-elevated)", borderRadius: "var(--radius-md)", border: "1px dashed var(--border-strong)" }}>
        <div style={{ fontSize: "2rem", marginBottom: "0.75rem", opacity: 0.3 }}>◻</div>
        <p style={{ fontSize: "0.85rem", color: "var(--fg-muted)" }}>Featured products management coming soon — will allow drag-and-drop ordering.</p>
      </div>
    </SectionCard>
  );
}

function AIFeaturesEditor() {
  const [items, setItems] = useState([
    { id: "1", title: "3D Visualization", desc: "Rotate and inspect every detail before you buy." },
    { id: "2", title: "AR Placement", desc: "Drop any piece into your room via your phone camera." },
    { id: "3", title: "AI Style Match", desc: "Tell us your aesthetic — our AI recommends pieces that work together." },
  ]);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <>
      <SectionCard title="AI & AR Feature Cards">
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {items.map((item, i) => (
            <div
              key={item.id}
              style={{
                padding: "1rem",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "0.875rem" }}>
                <input
                  className="input-base"
                  value={item.title}
                  placeholder="Feature title"
                  onChange={(e) => {
                    const updated = [...items];
                    updated[i] = { ...item, title: e.target.value };
                    setItems(updated);
                  }}
                />
                <input
                  className="input-base"
                  value={item.desc}
                  placeholder="Feature description"
                  onChange={(e) => {
                    const updated = [...items];
                    updated[i] = { ...item, desc: e.target.value };
                    setItems(updated);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <SaveButton onClick={handleSave} saved={saved} />
      </div>
    </>
  );
}

export default function AdminHomepagePage() {
  const [activeTab, setActiveTab] = useState<Tab>("hero");

  return (
    <div style={{ padding: "2.5rem 2rem", maxWidth: 1000 }}>
      <div style={{ marginBottom: "2rem" }}>
        <div className="section-label" style={{ marginBottom: "0.75rem" }}>Storefront</div>
        <h1 className="font-display" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "var(--fg-primary)", letterSpacing: "-0.025em" }}>
          Homepage Content
        </h1>
        <p style={{ marginTop: "0.375rem", fontSize: "0.875rem", color: "var(--fg-secondary)" }}>
          Manage what appears on the public-facing homepage.
        </p>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "0.25rem",
          marginBottom: "2rem",
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "0.375rem",
          flexWrap: "wrap",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              padding: "0.5rem 1rem",
              fontSize: "0.825rem",
              fontWeight: activeTab === tab.id ? 600 : 400,
              color: activeTab === tab.id ? "var(--fg-primary)" : "var(--fg-secondary)",
              background: activeTab === tab.id ? "var(--bg-surface)" : "transparent",
              border: activeTab === tab.id ? "1px solid var(--border)" : "1px solid transparent",
              borderRadius: "var(--radius-md)",
              cursor: "pointer",
              boxShadow: activeTab === tab.id ? "var(--shadow-sm)" : "none",
              transition: "all 0.15s ease",
            }}
          >
            <span style={{ fontSize: "0.75rem" }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "hero" && <HeroEditor />}
      {activeTab === "categories" && <CategoriesEditor />}
      {activeTab === "features" && <FeaturesEditor />}
      {activeTab === "products" && <FeaturedProductsEditor />}
      {activeTab === "ai" && <AIFeaturesEditor />}
    </div>
  );
}
