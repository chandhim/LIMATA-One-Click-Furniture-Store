"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { UploadCloud, X } from "lucide-react";

interface ImageUploadProps {
  onChange: (files: File[]) => void;
  initialImages?: string[];
}

export function ImageUpload({ onChange, initialImages = [] }: ImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>(initialImages);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setPreviews([...previews, ...newPreviews]);
    onChange(files);
  }

  function removePreview(index: number) {
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
  }

  return (
    <div>
      <input 
        type="file" 
        multiple 
        accept="image/*" 
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
          gap: "0.5rem"
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
        <UploadCloud size={24} style={{ color: "var(--fg-muted)", opacity: 0.7 }} />
        <span style={{ fontSize: "0.85rem", color: "var(--fg-secondary)", fontWeight: 600 }}>
          Upload product photos
        </span>
        <span style={{ fontSize: "0.72rem", color: "var(--fg-muted)" }}>
          Supports multiple PNG, JPG, WebP images
        </span>
      </div>

      {previews.length > 0 && (
        <div style={{ marginTop: "1rem", display: "flex", flexWrap: "wrap", gap: "0.625rem" }}>
          {previews.map((src, i) => (
            <div 
              key={i} 
              style={{ 
                position: "relative", 
                width: 72, 
                height: 72, 
                borderRadius: "var(--radius-sm)", 
                border: "1px solid var(--border)",
                overflow: "hidden",
                boxShadow: "var(--shadow-sm)"
              }}
            >
              <Image
                src={src}
                alt={`preview-${i}`}
                fill
                unoptimized
                style={{ objectFit: "cover" }}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removePreview(i);
                }}
                style={{
                  position: "absolute",
                  top: 2,
                  right: 2,
                  background: "rgba(0, 0, 0, 0.6)",
                  border: "none",
                  borderRadius: "50%",
                  width: 18,
                  height: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#fff",
                  padding: 0
                }}
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
