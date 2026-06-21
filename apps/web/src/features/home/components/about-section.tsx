"use client";

import { MapPin, Clock, Phone, ExternalLink } from "lucide-react";
import Link from "next/link";

export function AboutSection() {
  const stores = [
    {
      name: "LIMATA Flagship Store",
      address: "No 139/1 Main Street, Pugoda 10660",
      hours: "Mon - Sat: 9:00 AM - 7:00 PM\nSun: 10:00 AM - 5:00 PM",
      phone: "+94 11 234 5678",
      link: "https://maps.app.goo.gl/fBaqwbYhsamTEyuw7?g_st=aw",
      mapQuery: "LIMATA+Furniture,+No+139%2F1+Main+Street,+Pugoda+10660",
    },
    // {
    //   name: "LIMATA Concept Store",
    //   address: "Near Police Station Melsiripura, A6, Diyature",
    //   hours: "Mon - Sun: 10:00 AM - 8:00 PM",
    //   phone: "+94 11 987 6543",
    //   link: "https://maps.app.goo.gl/Hyf1iXZvAdvSQQ1E7?g_st=aw",
    //   mapQuery: "Police+station+Melsiripura,+A6,+Diyature",
    // },
  ];

  return (
    <section
      id="about"
      style={{
        padding: "6rem 1.5rem",
        background: "var(--bg-base)",
        position: "relative",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "4rem",
            maxWidth: "800px",
            margin: "0 auto 4rem",
          }}
        >
          <div
            style={{
              fontSize: "0.875rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--accent-dark)",
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            <span
              style={{ width: 30, height: 2, background: "var(--accent)" }}
            />
            Visit Us In Person
            <span
              style={{ width: 30, height: 2, background: "var(--accent)" }}
            />
          </div>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 700,
              color: "var(--fg-primary)",
              marginBottom: "1.5rem",
              lineHeight: 1.2,
            }}
          >
            Experience LIMATA Firsthand
          </h2>
          <p
            style={{
              fontSize: "1.0625rem",
              color: "var(--fg-secondary)",
              lineHeight: 1.6,
            }}
          >
            While our online store offers a seamless one-click experience,
            nothing beats feeling the textures and testing the comfort of our
            luxury pieces in person. Visit one of our physical showrooms to
            consult with our design experts.
          </p>
        </div>

        {/* Store Locations */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "2.5rem",
          }}
        >
          {stores.map((store, idx) => (
            <div
              key={idx}
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-xl)",
                overflow: "hidden",
                boxShadow: "var(--shadow-sm)",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              className="store-card"
            >
              {/* Map Iframe */}
              <div
                style={{
                  height: "280px",
                  width: "100%",
                  background: "var(--bg-elevated)",
                  position: "relative",
                }}
              >
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src={`https://maps.google.com/maps?q=${store.mapQuery}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={store.name}
                />
              </div>

              {/* Store Details */}
              <div
                style={{
                  padding: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "var(--fg-primary)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {store.name}
                </h3>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    marginTop: "1.5rem",
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                      alignItems: "flex-start",
                      color: "var(--fg-secondary)",
                    }}
                  >
                    <MapPin
                      size={18}
                      style={{
                        color: "var(--accent-dark)",
                        flexShrink: 0,
                        marginTop: "0.2rem",
                      }}
                    />
                    <span style={{ fontSize: "0.95rem", lineHeight: 1.5 }}>
                      {store.address}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                      alignItems: "flex-start",
                      color: "var(--fg-secondary)",
                    }}
                  >
                    <Clock
                      size={18}
                      style={{
                        color: "var(--accent-dark)",
                        flexShrink: 0,
                        marginTop: "0.2rem",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "0.95rem",
                        lineHeight: 1.5,
                        whiteSpace: "pre-line",
                      }}
                    >
                      {store.hours}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                      alignItems: "flex-start",
                      color: "var(--fg-secondary)",
                    }}
                  >
                    <Phone
                      size={18}
                      style={{
                        color: "var(--accent-dark)",
                        flexShrink: 0,
                        marginTop: "0.2rem",
                      }}
                    />
                    <span style={{ fontSize: "0.95rem", lineHeight: 1.5 }}>
                      {store.phone}
                    </span>
                  </div>
                </div>

                <div style={{ marginTop: "2rem" }}>
                  <a
                    href={store.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      width: "100%",
                      padding: "0.875rem",
                      background: "var(--bg-elevated)",
                      border: "1.5px solid var(--border)",
                      borderRadius: "var(--radius-md)",
                      color: "var(--fg-primary)",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      textDecoration: "none",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "var(--accent)";
                      (e.currentTarget as HTMLElement).style.color =
                        "var(--accent-dark)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "var(--border)";
                      (e.currentTarget as HTMLElement).style.color =
                        "var(--fg-primary)";
                    }}
                  >
                    Get Directions <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .store-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }
      `}</style>
    </section>
  );
}
