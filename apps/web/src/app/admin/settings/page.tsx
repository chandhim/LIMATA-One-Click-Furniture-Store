"use client";

import { useState, useEffect, useRef } from "react";
import { useAdminSettings, useUpdateSetting } from "@/features/admin/hooks/use-admin";
import { uploadImages } from "@/features/admin-products/services/admin-product.service";
import Image from "next/image";
import { Image as ImageIcon, Globe, Save, Phone, Mail, MapPin, Store } from "lucide-react";

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

export default function AdminSettingsPage() {
  const { data: settings = {}, isLoading } = useAdminSettings();
  const updateSettingMutation = useUpdateSetting();

  const [store, setStore] = useState({
    name: "LIMATA",
    email: "hello@limata.com",
    phone: "+91 98765 43210",
    address: "123 Design Street, Mumbai, Maharashtra 400001",
  });

  const [branding, setBranding] = useState({
    logoUrl: "",
    faviconUrl: "",
  });

  const [saved, setSaved] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (settings.store_info) {
      setStore(settings.store_info);
    }
    if (settings.store_branding) {
      setBranding(settings.store_branding);
    }
  }, [settings]);

  async function handleSave() {
    try {
      await updateSettingMutation.mutateAsync({ key: "store_info", value: store });
      await updateSettingMutation.mutateAsync({ key: "store_branding", value: branding });

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingLogo(true);
      const res = await uploadImages([file]);
      if (res.urls?.[0]) {
        setBranding((prev) => ({ ...prev, logoUrl: res.urls[0] }));
      }
    } catch (err) {
      console.error("Logo upload failed:", err);
    } finally {
      setUploadingLogo(false);
    }
  }

  async function handleFaviconUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingFavicon(true);
      const res = await uploadImages([file]);
      if (res.urls?.[0]) {
        setBranding((prev) => ({ ...prev, faviconUrl: res.urls[0] }));
      }
    } catch (err) {
      console.error("Favicon upload failed:", err);
    } finally {
      setUploadingFavicon(false);
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
          Site Settings
        </h1>
        <p style={{ marginTop: "0.375rem", fontSize: "0.875rem", color: "var(--fg-secondary)" }}>
          Configure global metadata, storefront branding icons, and general contact details.
        </p>
      </div>

      {/* Store Info Section */}
      <SectionCard title="Store Profile Details" icon={Store}>
        <div className="settings-form-grid" style={{ marginBottom: "0.5rem" }}>
          <FormField label="Store Corporate Name">
            <input 
              type="text"
              className="input-base" 
              value={store.name} 
              onChange={(e) => setStore({ ...store, name: e.target.value })} 
            />
          </FormField>
          
          <FormField label="Corporate Support Email">
            <div style={{ position: "relative" }}>
              <Mail size={14} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--fg-muted)" }} />
              <input 
                className="input-base" 
                type="email" 
                value={store.email} 
                onChange={(e) => setStore({ ...store, email: e.target.value })} 
                style={{ paddingLeft: "2.25rem" }}
              />
            </div>
          </FormField>

          <FormField label="Corporate Phone Number">
            <div style={{ position: "relative" }}>
              <Phone size={14} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--fg-muted)" }} />
              <input 
                className="input-base" 
                value={store.phone} 
                onChange={(e) => setStore({ ...store, phone: e.target.value })} 
                style={{ paddingLeft: "2.25rem" }}
              />
            </div>
          </FormField>
        </div>
        
        <FormField label="Corporate Physical Address">
          <div style={{ position: "relative" }}>
            <MapPin size={14} style={{ position: "absolute", left: "0.875rem", top: "1.1rem", color: "var(--fg-muted)" }} />
            <textarea 
              className="input-base" 
              rows={2} 
              value={store.address} 
              onChange={(e) => setStore({ ...store, address: e.target.value })} 
              style={{ resize: "vertical", paddingLeft: "2.25rem" }} 
            />
          </div>
        </FormField>
      </SectionCard>

      {/* Branding Section */}
      <SectionCard title="Branding Configurations" icon={ImageIcon}>
        <div className="settings-form-grid" style={{ gap: "1.5rem" }}>
          <div>
            <FormField label="Brand Logo Image" hint="Drawn as the main logo header on public pages.">
              <input type="file" ref={logoInputRef} onChange={handleLogoUpload} style={{ display: "none" }} accept="image/*" />
              
              <div
                onClick={() => logoInputRef.current?.click()}
                style={{
                  border: "2px dashed var(--border-strong)",
                  borderRadius: "var(--radius-md)",
                  padding: "2rem",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  background: "var(--bg-elevated)",
                  minHeight: 130,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "var(--accent)";
                  el.style.background = "rgba(201,169,110,0.02)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "var(--border-strong)";
                  el.style.background = "var(--bg-elevated)";
                }}
              >
                {uploadingLogo ? (
                  <span style={{ fontSize: "0.85rem", color: "var(--fg-muted)", fontWeight: 500 }}>Uploading Logo...</span>
                ) : branding.logoUrl ? (
                  <div style={{ position: "relative", width: "100%", height: 60 }}>
                    <Image src={branding.logoUrl} alt="Store logo" fill style={{ objectFit: "contain" }} unoptimized />
                  </div>
                ) : (
                  <>
                    <ImageIcon size={22} style={{ color: "var(--fg-muted)", opacity: 0.6, marginBottom: "0.5rem" }} />
                    <p style={{ fontSize: "0.8rem", color: "var(--fg-secondary)", margin: 0, fontWeight: 500 }}>Click to upload logo</p>
                  </>
                )}
              </div>
            </FormField>
          </div>
          
          <div>
            <FormField label="Site Favicon Icon" hint="Displayed inside web browser address title tabs.">
              <input type="file" ref={faviconInputRef} onChange={handleFaviconUpload} style={{ display: "none" }} accept="image/*" />
              
              <div
                onClick={() => faviconInputRef.current?.click()}
                style={{
                  border: "2px dashed var(--border-strong)",
                  borderRadius: "var(--radius-md)",
                  padding: "2rem",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  background: "var(--bg-elevated)",
                  minHeight: 130,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "var(--accent)";
                  el.style.background = "rgba(201,169,110,0.02)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "var(--border-strong)";
                  el.style.background = "var(--bg-elevated)";
                }}
              >
                {uploadingFavicon ? (
                  <span style={{ fontSize: "0.85rem", color: "var(--fg-muted)", fontWeight: 500 }}>Uploading Favicon...</span>
                ) : branding.faviconUrl ? (
                  <div style={{ position: "relative", width: 44, height: 44 }}>
                    <Image src={branding.faviconUrl} alt="Store favicon" fill style={{ objectFit: "contain" }} unoptimized />
                  </div>
                ) : (
                  <>
                    <Globe size={22} style={{ color: "var(--fg-muted)", opacity: 0.6, marginBottom: "0.5rem" }} />
                    <p style={{ fontSize: "0.8rem", color: "var(--fg-secondary)", margin: 0, fontWeight: 500 }}>Click to upload favicon</p>
                  </>
                )}
              </div>
            </FormField>
          </div>
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
          <span>{saved ? "Branding Saved Successfully" : "Save All Configurations"}</span>
        </button>
      </div>

      <style>{`
        .settings-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }
        @media (max-width: 768px) {
          .settings-form-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
