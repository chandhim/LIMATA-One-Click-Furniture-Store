"use client";

import { useState, useRef } from "react";
import { UploadCloud, Box } from "lucide-react";

interface ModelUploadProps {
  onChange: (file: File | null) => void;
  initialUrl?: string;
}

export function ModelUpload({ onChange, initialUrl }: ModelUploadProps) {
  const [fileName, setFileName] = useState<string | null>(
    initialUrl ? "Existing model" : null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith(".glb")) {
        alert("Only .glb files are allowed");
        return;
      }
      setFileName(file.name);
      onChange(file);
    }
  }

  return (
    <div>
      <input
        type="file"
        accept=".glb"
        onChange={handleChange}
        ref={fileInputRef}
        style={{ display: "none" }}
      />

      {/* Custom upload dropzone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: "2px dashed var(--border-strong)",
          borderRadius: "var(--radius-md)",
          padding: "1.75rem",
          textAlign: "center",
          cursor: "pointer",
          background: "var(--bg-elevated)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s ease",
          gap: "0.5rem",
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
        <UploadCloud
          size={24}
          style={{ color: "var(--fg-muted)", opacity: 0.7 }}
        />
        <span
          style={{
            fontSize: "0.85rem",
            color: "var(--fg-secondary)",
            fontWeight: 600,
          }}
        >
          Upload 3D AR Model
        </span>
        <span style={{ fontSize: "0.72rem", color: "var(--fg-muted)" }}>
          Required format: .glb file
        </span>
      </div>

      {fileName && (
        <div
          style={{
            marginTop: "1rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.375rem",
            padding: "0.375rem 0.75rem",
            background: "rgba(201,169,110,0.08)",
            border: "1px solid rgba(201,169,110,0.2)",
            borderRadius: "var(--radius-sm)",
            fontSize: "0.78rem",
            fontWeight: 600,
            color: "var(--accent-dark)",
          }}
        >
          <Box size={12} />
          <span>Active: {fileName}</span>
        </div>
      )}
    </div>
  );
}
