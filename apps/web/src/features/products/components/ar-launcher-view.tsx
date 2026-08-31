"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Box } from "lucide-react";

interface ARLauncherViewProps {
  modelUrl: string;
  productName?: string;
  dimensions?: { width: number; depth: number; height: number };
}

export function ARLauncherView({ modelUrl, productName, dimensions }: ARLauncherViewProps) {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [arStatus, setArStatus] = useState<string>("not-presenting");
  const [hasPresented, setHasPresented] = useState(false);
  const modelViewerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    import("@google/model-viewer").then(() => {
      const a = document.createElement("a");
      const canRelAR = a.relList?.supports?.("ar") || false; 
      const isAndroid = /android/i.test(navigator.userAgent); 
      setIsSupported(canRelAR || isAndroid);
    });
  }, []);

  useEffect(() => {
    const el = modelViewerRef.current;
    const handleArStatus = (e: Event) => {
      const status = (e as CustomEvent).detail?.status;
      setArStatus(status || "not-presenting");
      if (status === "session-started" || status === "object-placed") {
        setHasPresented(true);
      }
    };
    if (el) {
      el.addEventListener("ar-status", handleArStatus);
      return () => el.removeEventListener("ar-status", handleArStatus);
    }
  }, [isSupported]);

  if (isSupported === false) {
    return (
      <button
        disabled
        style={{
          width: "100%",
          padding: "1rem",
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-full)",
          color: "var(--fg-muted)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          cursor: "not-allowed",
          fontWeight: 600,
        }}
      >
        <Box size={20} /> AR Not Supported on this Device
      </button>
    );
  }

  const fetchUrl = modelUrl.replace(
    "https://pub-cc6bc0ad895f4273912e59614e1effe0.r2.dev/models",
    "/r2-models",
  );
  
  // Post-AR Return Experience
  if (hasPresented && arStatus === "not-presenting") {
    return (
      <div style={{ padding: "1.5rem", background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", textAlign: "center", display: "flex", flexDirection: "column", gap: "1rem", boxShadow: "var(--shadow-sm)" }}>
        <div>
          <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--fg-primary)", marginBottom: "0.25rem" }}>How does it look?</div>
          <div style={{ fontSize: "0.9rem", color: "var(--fg-secondary)" }}>Your AR visualization session has ended.</div>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
          <button
            onClick={() => setHasPresented(false)}
            style={{ padding: "0.6rem 1rem", borderRadius: "var(--radius-full)", border: "1px solid var(--border)", background: "transparent", color: "var(--fg-primary)", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer" }}
          >
            Reopen AR
          </button>
          <button
            onClick={() => {
              const el = document.getElementById("add-to-cart-section");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            style={{ padding: "0.6rem 1rem", borderRadius: "var(--radius-full)", border: "none", background: "var(--accent)", color: "#fff", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer" }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", padding: "1.25rem", background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-sm)" }}>
      {/* Lightweight Pre-AR Context */}
      <div>
        {productName && <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--fg-primary)", marginBottom: "0.25rem" }}>{productName}</div>}
        {dimensions && (
          <div style={{ fontSize: "0.95rem", color: "var(--fg-secondary)", marginBottom: "0.75rem" }}>
            {dimensions.width} &times; {dimensions.depth} &times; {dimensions.height} cm
          </div>
        )}
        <div style={{ fontSize: "0.875rem", color: "var(--fg-muted)" }}>
          Place this product in your space to see how it looks at full scale.
        </div>
      </div>

      <div style={{ position: "relative", width: "100%", height: "50px" }}>
        {React.createElement("model-viewer", {
          ref: modelViewerRef,
          src: fetchUrl,
          ar: true,
          "ar-modes": "webxr scene-viewer quick-look",
          loading: "lazy",
          style: {
            width: "100%",
            height: "100%",
            backgroundColor: "transparent",
            "--poster-color": "transparent",
          },
        },
          <button
            slot="ar-button"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              padding: "0.875rem",
              background: "var(--accent)",
              color: "var(--bg-base)",
              border: "none",
              borderRadius: "var(--radius-full)",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
            }}
          >
            <Box size={18} /> See it in your room
          </button>
        )}
      </div>
    </div>
  );
}
