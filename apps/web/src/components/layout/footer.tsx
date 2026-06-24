"use client";

import Link from "next/link";
import { usePublicSetting } from "@/features/admin/hooks/use-admin";

interface FooterLink {
  label: string;
  href: string;
}

export function Footer() {
  const year = new Date().getFullYear();
  const { data: footerCompany } = usePublicSetting("footer_company");
  const { data: footerLinks } = usePublicSetting("footer_links");
  const { data: footerSocial } = usePublicSetting("footer_social");

  const company = footerCompany ?? {
    name: "LIMATA",
    desc: "One-click furniture shopping with AI visualization. Transform your space with curated, quality pieces.",
    copyright: `© ${year} LIMATA. All rights reserved.`,
  };

  const links: FooterLink[] = (footerLinks as FooterLink[]) ?? [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "Categories", href: "/#categories" },
    { label: "About", href: "/#about" },
  ];

  const defaultSocial = {
    facebook: "https://facebook.com/limata",
    instagram: "https://instagram.com/limata",
    linkedin: "https://linkedin.com/company/limata",
  };

  const social = footerSocial || defaultSocial;

  return (
    <footer
      style={{
        background: "var(--bg-dark)",
        color: "var(--fg-inverse)",
        paddingTop: "4rem",
        paddingBottom: "2rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative top gradient */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background:
            "linear-gradient(90deg, transparent, var(--accent), transparent)",
        }}
      />

      {/* Decorative background blob */}
      <div
        style={{
          position: "absolute",
          bottom: "-4rem",
          right: "-6rem",
          width: "24rem",
          height: "24rem",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem" }}
      >
        {/* Main Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "3rem",
            paddingBottom: "3rem",
          }}
        >
          {/* Brand Column */}
          <div style={{ gridColumn: "span 2" }}>
            <div
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.75rem",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                display: "flex",
                alignItems: "center",
                gap: 4,
                marginBottom: "1rem",
              }}
            >
              {company.name}
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--accent)",
                  display: "inline-block",
                  marginBottom: 12,
                  marginLeft: 2,
                }}
              />
            </div>
            <p
              style={{
                fontSize: "0.9375rem",
                color: "rgba(250,249,247,0.55)",
                lineHeight: 1.7,
                maxWidth: "22rem",
                marginBottom: "1.5rem",
              }}
            >
              {company.desc}
            </p>
            {/* Social Links */}
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {Object.entries(social).map(([platform, url]) => {
                if (!url) return null;
                const labelMap: Record<string, string> = {
                  facebook: "FB",
                  instagram: "IG",
                  linkedin: "LN",
                  tiktok: "TT",
                };
                const label =
                  labelMap[platform] || platform.slice(0, 2).toUpperCase();

                return (
                  <a
                    key={platform}
                    href={url as string}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid rgba(250,249,247,0.12)",
                      background: "rgba(250,249,247,0.05)",
                      color: "rgba(250,249,247,0.5)",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition:
                        "border-color 0.2s, color 0.2s, background 0.2s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "var(--accent)";
                      (e.currentTarget as HTMLElement).style.color =
                        "var(--accent)";
                      (e.currentTarget as HTMLElement).style.background =
                        "rgba(201,169,110,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "rgba(250,249,247,0.12)";
                      (e.currentTarget as HTMLElement).style.color =
                        "rgba(250,249,247,0.5)";
                      (e.currentTarget as HTMLElement).style.background =
                        "rgba(250,249,247,0.05)";
                    }}
                  >
                    {label}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Column */}
          <div>
            <div
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--accent)",
                marginBottom: "1.25rem",
              }}
            >
              Navigate
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  style={{
                    fontSize: "0.9rem",
                    color: "rgba(250,249,247,0.55)",
                    textDecoration: "none",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.color =
                      "var(--fg-inverse)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.color =
                      "rgba(250,249,247,0.55)")
                  }
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal Column */}
          <div>
            <div
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--accent)",
                marginBottom: "1.25rem",
              }}
            >
              Legal
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                (label) => (
                  <span
                    key={label}
                    style={{
                      fontSize: "0.9rem",
                      color: "rgba(250,249,247,0.55)",
                      cursor: "pointer",
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.color =
                        "var(--fg-inverse)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.color =
                        "rgba(250,249,247,0.55)")
                    }
                  >
                    {label}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: "1px solid rgba(250,249,247,0.08)",
            paddingTop: "1.5rem",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.75rem",
          }}
        >
          <p style={{ fontSize: "0.8125rem", color: "rgba(250,249,247,0.35)" }}>
            {company.copyright}
          </p>
          <p style={{ fontSize: "0.8125rem", color: "rgba(250,249,247,0.25)" }}>
            Crafted with care for beautiful spaces
          </p>
        </div>
      </div>
    </footer>
  );
}
