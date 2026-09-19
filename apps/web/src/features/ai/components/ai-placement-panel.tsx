"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { usePlacement } from "../hooks/use-placement";
import { UploadCloud, CheckCircle2, XCircle, AlertTriangle, ScanLine, X, Loader2, Sparkles, Camera } from "lucide-react";
import { toast } from "sonner";
import type { PlacementEvaluationResult } from "../types/placement.types";
import { CameraCapture } from "./camera-capture";

interface AiPlacementPanelProps {
  productId: string;
  onLaunchAr?: () => void;
}

export function AiPlacementPanel({ productId, onLaunchAr }: AiPlacementPanelProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<PlacementEvaluationResult | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
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

  const handleCameraCapture = (file: File) => {
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setIsCameraActive(false);
    setResult(null);
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
    setIsCameraActive(false);
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
        isCameraActive ? (
          <CameraCapture onCapture={handleCameraCapture} onCancel={() => setIsCameraActive(false)} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--fg-primary)", textAlign: "center" }}>How would you like to add your room?</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1.5rem" }}>
              <div
                onClick={() => setIsCameraActive(true)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)",
                  padding: "2.5rem 1.5rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  background: "var(--bg-base)",
                  boxShadow: "var(--shadow-sm)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; }}
              >
                <div style={{ background: "var(--bg-surface)", padding: "1rem", borderRadius: "50%", color: "var(--accent)", boxShadow: "var(--shadow-sm)" }}>
                  <Camera size={28} />
                </div>
                <div style={{ fontWeight: 600, color: "var(--fg-primary)", fontSize: "1.05rem" }}>Take a photo</div>
              </div>

              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)",
                  padding: "2.5rem 1.5rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  background: "var(--bg-base)",
                  boxShadow: "var(--shadow-sm)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; }}
              >
                <div style={{ background: "var(--bg-surface)", padding: "1rem", borderRadius: "50%", color: "var(--accent)", boxShadow: "var(--shadow-sm)" }}>
                  <UploadCloud size={28} />
                </div>
                <div style={{ fontWeight: 600, color: "var(--fg-primary)", fontSize: "1.05rem" }}>Upload a photo</div>
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileSelect}
            />
          </div>
        )
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
                  background: "rgba(0,0,0,0.6)",
                  backdropFilter: "blur(4px)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  gap: "1.5rem",
                }}
              >
                <ScanLine size={48} style={{ animation: "pulse 1.5s infinite" }} color="var(--accent)" />
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "center" }}>
                  <div style={{ fontWeight: 600, letterSpacing: "0.05em", fontSize: "1.1rem" }}>✨ Analyzing space</div>
                  <div style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.7)" }}>Reading relative depth & clearance...</div>
                </div>
              </div>
            )}
          </div>

          {/* Sequential Loading Indicator underneath */}
          {isPending && (
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "1.5rem", background: "var(--bg-elevated)", borderRadius: "var(--radius-md)" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--accent-dark)", marginBottom: "1rem" }}>
                ✨ LIMATA is analyzing your room...
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--fg-primary)", animation: "fadeIn 0.5s ease" }}>
                  <div style={{ width: "1.25rem", height: "1.25rem", borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.75rem" }}>✓</div>
                  <span>Understanding the room</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--fg-primary)", animation: "fadeIn 0.5s ease 1s both" }}>
                  <div style={{ width: "1.25rem", height: "1.25rem", borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.75rem" }}>✓</div>
                  <span>Evaluating available space</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--fg-secondary)", animation: "fadeIn 0.5s ease 2s both" }}>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Evaluating placement clearance</span>
                </div>
              </div>
            </div>
          )}

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
              <div style={{ padding: "1.5rem", borderRadius: "var(--radius-lg)", background: "var(--bg-base)", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--fg-primary)" }}>
                    LIMATA understands your space
                  </div>

                  {/* What we detected */}
                  {!!result.evaluation_metadata?.objects_detected && Array.isArray(result.evaluation_metadata.objects_detected) && result.evaluation_metadata.objects_detected.length > 0 && (
                    <div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>What we detected</div>
                      <div style={{ fontSize: "0.95rem", color: "var(--fg-secondary)" }}>
                        {result.evaluation_metadata.objects_detected.map(o => String(o).toLowerCase()).join(", ")} identified in your photo.
                      </div>
                    </div>
                  )}

                  {/* Depth & space / Estimated clearance */}
                  {result.estimated_clearance && (
                    <div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>Depth & space</div>
                      <div style={{ fontSize: "0.95rem", color: "var(--fg-secondary)", marginBottom: "0.5rem" }}>
                        LIMATA analyzed the visual depth of the scene.
                      </div>
                      <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.9rem", color: "var(--fg-primary)", fontWeight: 500 }}>
                        {Object.entries(result.estimated_clearance).map(([k, v]) => (
                          <div key={k}>
                            {k.charAt(0).toUpperCase() + k.slice(1)}: {String(v)} cm
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Placement assessment */}
                  <div style={{ paddingTop: "0.75rem", borderTop: "1px solid var(--border)" }}>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>Placement assessment</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                      {result.suitable ? <CheckCircle2 size={18} color="#16a34a" /> : <XCircle size={18} color="#dc2626" />}
                      <div style={{ fontWeight: 600, color: result.suitable ? "#16a34a" : "#dc2626", fontSize: "1rem" }}>
                        {result.suitable ? "This product appears suitable for the evaluated area." : "Space may be limited"}
                      </div>
                    </div>
                    
                    {!result.suitable && result.limiting_factor && (
                      <div style={{ fontSize: "0.95rem", color: "var(--fg-secondary)", marginTop: "0.25rem" }}>
                        {result.limiting_factor.charAt(0).toUpperCase() + result.limiting_factor.slice(1)} appears to be the main consideration for this placement.
                      </div>
                    )}
                  </div>
                  
                  {/* AR Handoff */}
                  {result.suitable && onLaunchAr && (
                    <div style={{ marginTop: "0.5rem", paddingTop: "1.25rem", borderTop: "1px dashed var(--border)" }}>
                      <p style={{ fontSize: "0.875rem", color: "var(--fg-secondary)", marginBottom: "0.75rem", fontWeight: 500 }}>
                        AI fit check complete. Now visualize the product at full scale.
                      </p>
                      <button
                        onClick={onLaunchAr}
                        style={{
                          width: "100%",
                          padding: "0.875rem",
                          background: "var(--accent)",
                          color: "#fff",
                          border: "none",
                          borderRadius: "var(--radius-full)",
                          fontSize: "0.9375rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "var(--shadow-md)",
                          transition: "transform 0.2s"
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                        onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                      >
                        See it in your room &rarr;
                      </button>
                    </div>
                  )}

                  {/* Chat with LIMATA AI Button */}
                  <div style={{ marginTop: "0.5rem", paddingTop: "1.25rem", borderTop: "1px dashed var(--border)" }}>
                    <button
                      onClick={() => {
                        window.dispatchEvent(
                          new CustomEvent("open-ai-chat", {
                            detail: {
                              context: {
                                ar_placement: {
                                  suitable: result.suitable,
                                  limiting_factor: result.limiting_factor,
                                  estimated_clearance: result.estimated_clearance,
                                  warnings: result.warnings || []
                                }
                              }
                            }
                          })
                        );
                      }}
                      style={{
                        width: "100%",
                        padding: "0.875rem",
                        background: "var(--bg-base)",
                        color: "var(--accent-dark)",
                        border: "1px solid var(--accent)",
                        borderRadius: "var(--radius-full)",
                        fontSize: "0.9375rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                        boxShadow: "var(--shadow-sm)",
                        transition: "transform 0.2s"
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                      onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                    >
                      <Sparkles size={18} /> Discuss with LIMATA AI
                    </button>
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
                            ? "These measurements are visual estimates. Please check the product's exact dimensions before purchasing."
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
