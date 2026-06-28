"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Box } from "lucide-react";

interface ARLauncherViewProps {
  modelUrl: string;
}

export function ARLauncherView({ modelUrl }: ARLauncherViewProps) {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);

  useEffect(() => {
    // Dynamically import @google/model-viewer to avoid SSR issues
    import("@google/model-viewer").then(() => {
      // Basic check for AR support on mobile devices
      const a = document.createElement("a");
      const canRelAR = a.relList?.supports?.("ar") || false; // iOS Quick Look
      const isAndroid = /android/i.test(navigator.userAgent); // Android Scene Viewer
      setIsSupported(canRelAR || isAndroid);
    });
  }, []);

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
  
  // Generate the corresponding USDZ URL for iOS Quick Look
  // We keep this as an ABSOLUTE URL because iOS Quick Look runs as an external OS process
  // and does not require CORS proxies. Absolute URLs are much more reliable for it.
  const iosUrl = modelUrl.replace(/\.glb$/i, ".usdz");

  return (
    <div style={{ position: "relative", width: "100%", height: "56px" }}>
      {React.createElement("model-viewer", {
        src: fetchUrl,
        "ios-src": iosUrl,
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
            padding: "1rem",
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
            boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)";
          }}
        >
          <Box size={20} /> View in Your Space
        </button>
      )}
    </div>
  );
}
