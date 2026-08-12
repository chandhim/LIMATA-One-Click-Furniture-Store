"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { usePlacement } from "../hooks/use-placement";
import { UploadCloud, CheckCircle2, XCircle, AlertTriangle, ScanLine, X } from "lucide-react";
import { toast } from "sonner";
import type { PlacementEvaluationResult } from "../types/placement.types";

interface AiPlacementPanelProps {
  productId: string;
}

export function AiPlacementPanel({ productId }: AiPlacementPanelProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<PlacementEvaluationResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: evaluatePlacement, isPending } = usePlacement();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleAnalyze = () => {
    if (!selectedImage) return;

    evaluatePlacement(
      { productId, image: selectedImage },
      {
        onSuccess: (data) => {
          setResult(data);
        },
        onError: () => {
          toast.error("Failed to analyze placement. Please try again.");
        },
      }
    );
  };

  const reset = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        background: "var(--bg-surface)",
        borderRadius: "var(--radius-xl)",
        border: "1px solid var(--border)",
        padding: "1.5rem",
        minHeight: "400px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--fg-primary)", marginBottom: "0.25rem" }}>
            Will it fit? (AI)
          </h2>
          <p style={{ fontSize: "0.875rem", color: "var(--fg-secondary)" }}>
            Upload a photo of your room to let our AI visually estimate if this furniture fits.
          </p>
        </div>
        {(selectedImage || result) && !isPending && (
          <button
            onClick={reset}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              fontSize: "0.8125rem",
              fontWeight: 600,
              color: "var(--fg-secondary)",
              background: "transparent",
              border: "1px solid var(--border)",
              padding: "0.4rem 0.75rem",
              borderRadius: "var(--radius-full)",
              cursor: "pointer",
            }}
          >
            <X size={14} /> Clear
          </button>
        )}
      </div>

      {!selectedImage ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            border: "2px dashed var(--border-strong)",
            borderRadius: "var(--radius-lg)",
            padding: "3rem 2rem",
            cursor: "pointer",
            transition: "background 0.2s",
            background: "rgba(0,0,0,0.02)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-base)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.02)")}
        >
          <div style={{ background: "var(--bg-base)", padding: "1rem", borderRadius: "50%", color: "var(--accent-dark)", boxShadow: "var(--shadow-sm)" }}>
            <UploadCloud size={32} />
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontWeight: 600, color: "var(--fg-primary)", marginBottom: "0.25rem" }}>Click to upload a room photo</div>
            <div style={{ fontSize: "0.8125rem", color: "var(--fg-muted)" }}>Supports JPG, PNG, WEBP</div>
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Image Preview Area */}
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "4/3",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              border: "1px solid var(--border)",
            }}
          >
            {previewUrl && (
              <Image src={previewUrl} alt="Room preview" fill className="object-cover" />
            )}
            
            {/* Scanning Overlay */}
            {isPending && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.4)",
                  backdropFilter: "blur(2px)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  gap: "1rem",
                }}
              >
                <ScanLine size={48} style={{ animation: "pulse 1.5s infinite" }} />
                <div style={{ fontWeight: 600, letterSpacing: "0.05em" }}>ANALYZING SPACE...</div>
              </div>
            )}
          </div>

          {/* Action / Result Area */}
          {!result && !isPending && (
            <button
              onClick={handleAnalyze}
              style={{
                width: "100%",
                padding: "0.875rem",
                background: "var(--bg-dark)",
                color: "var(--fg-inverse)",
                border: "none",
                borderRadius: "var(--radius-full)",
                fontSize: "0.9375rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <ScanLine size={18} /> Analyze Fit
            </button>
          )}

          {result && !isPending && (
            <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              
              {/* Primary Result Banner */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "1rem",
                  borderRadius: "var(--radius-md)",
                  background: result.suitable ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
                  border: `1px solid ${result.suitable ? "rgba(34, 197, 94, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
                }}
              >
                {result.suitable ? (
                  <CheckCircle2 size={24} color="#16a34a" />
                ) : (
                  <XCircle size={24} color="#dc2626" />
                )}
                <div>
                  <div style={{ fontWeight: 700, color: result.suitable ? "#16a34a" : "#dc2626", fontSize: "1.05rem" }}>
                    {result.suitable ? "Looks like a good fit!" : "Might be a tight fit"}
                  </div>
                  {!result.suitable && result.limiting_factor && (
                    <div style={{ fontSize: "0.875rem", color: "var(--fg-secondary)", marginTop: "0.25rem" }}>
                      Limiting Factor: {result.limiting_factor}
                    </div>
                  )}
                </div>
              </div>

              {/* Data Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.75rem",
                }}
              >
                <div style={{ background: "var(--bg-base)", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--fg-muted)", fontWeight: 600, textTransform: "uppercase", marginBottom: "0.25rem" }}>
                    Confidence
                  </div>
                  <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--fg-primary)" }}>
                    Heuristic Confidence: {Math.round(result.evaluation_confidence * 100)}%
                  </div>
                </div>

                <div style={{ background: "var(--bg-base)", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--fg-muted)", fontWeight: 600, textTransform: "uppercase", marginBottom: "0.25rem" }}>
                    Orientation
                  </div>
                  <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--fg-primary)" }}>
                    {result.evaluated_orientation ? result.evaluated_orientation.replace("_", " ") : "N/A"}
                  </div>
                </div>
              </div>

              {/* Warnings List (Always visible if present) */}
              {result.warnings && result.warnings.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
                  {result.warnings.map((warning, idx) => {
                    const isDimensionsWarning = warning === "DIMENSIONS_UNAVAILABLE";
                    return (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          gap: "0.5rem",
                          alignItems: "flex-start",
                          background: isDimensionsWarning ? "rgba(245, 158, 11, 0.1)" : "rgba(239, 68, 68, 0.05)",
                          padding: "0.75rem",
                          borderRadius: "var(--radius-sm)",
                          border: `1px solid ${isDimensionsWarning ? "rgba(245, 158, 11, 0.3)" : "var(--border)"}`,
                        }}
                      >
                        <AlertTriangle size={16} color={isDimensionsWarning ? "#d97706" : "var(--fg-secondary)"} style={{ flexShrink: 0, marginTop: "0.1rem" }} />
                        <span style={{ fontSize: "0.8125rem", color: isDimensionsWarning ? "#d97706" : "var(--fg-secondary)", lineHeight: 1.5, fontWeight: isDimensionsWarning ? 500 : 400 }}>
                          {isDimensionsWarning 
                            ? "Notice: Exact product dimensions are currently unavailable. This result is a heuristic visual estimation of space, not a metric-accurate measurement."
                            : warning}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
