"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { UploadCloud, ScanLine, X, AlertCircle, Sparkles, Loader2, Camera, Lightbulb, Maximize2, Sun, Armchair, Check } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/store/use-auth-store";
import { useVisualRecommend } from "../hooks/use-visual-recommend";
import { ProductCard } from "@/features/products/components/product-card";
import type { ProductSummary } from "@/features/products/types/product.types";
import { CameraCapture } from "./camera-capture";

export function VisualRecommendPanel({
  allProducts,
  onClose,
}: {
  allProducts: ProductSummary[];
  onClose?: () => void;
}) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: analyzeRoom, isPending, data, isError, error, reset } = useVisualRecommend();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAuthenticated) {
      toast.error("Please log in to use Shop This Room");
      return;
    }
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      reset();
    }
  };

  const handleCameraCapture = (file: File) => {
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setIsCameraActive(false);
    reset();
  };

  const handleAnalyze = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to use Shop This Room");
      return;
    }
    if (!selectedImage) return;
    analyzeRoom(
      { image: selectedImage },
      {
        onError: () => {
          // Toast removed here, error state handles it in the UI natively
        },
      }
    );
  };

  const handleClear = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Resolve recommended products
  const recommendedProducts = data?.recommended_product_ids
    .map(id => allProducts.find(p => p.productId === id))
    .filter((p): p is ProductSummary => p !== undefined) || [];



  return (
    <div
      className="p-4 sm:p-8"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        background: "var(--bg-surface)",
        borderRadius: "var(--radius-xl)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.5rem", fontWeight: 700, color: "var(--fg-primary)", marginBottom: "0.5rem" }}>
            <Sparkles size={24} color="var(--accent)" />
            Shop This Room
          </h2>
          <p style={{ fontSize: "0.95rem", color: "var(--fg-secondary)", maxWidth: "600px" }}>
            Upload a photo of your room and we&apos;ll suggest furniture that complements what you already have.
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "none",
              color: "var(--fg-muted)",
              cursor: "pointer",
              padding: "0.5rem",
            }}
            aria-label="Close Shop This Room"
          >
            <X size={24} />
          </button>
        )}
      </div>

      {/* Guest Login Hint Banner */}
      {!isAuthenticated && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.75rem",
            background: "rgba(201,169,110,0.08)",
            border: "1px solid rgba(201,169,110,0.3)",
            borderRadius: "var(--radius-lg)",
            padding: "0.85rem 1.25rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <Sparkles size={18} color="var(--accent)" />
            <span style={{ fontSize: "0.9rem", color: "var(--fg-primary)", fontWeight: 500 }}>
              Sign in to your LIMATA account to analyze your room with AI and view personalized recommendations
            </span>
          </div>
          <Link
            href="/login?redirect=/shop-this-room"
            style={{
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "#fff",
              background: "var(--accent)",
              padding: "0.45rem 1.15rem",
              borderRadius: "var(--radius-full)",
              textDecoration: "none",
              transition: "all 0.2s ease",
            }}
          >
            Log In
          </Link>
        </div>
      )}

      {/* Input or Result Split */}
      {!data && !isError && (
        <div className={`grid gap-8 items-start ${selectedImage ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
          
          {/* Upload / Camera Area */}
          {!selectedImage ? (
            isCameraActive ? (
              <CameraCapture onCapture={handleCameraCapture} onCancel={() => setIsCameraActive(false)} />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--fg-primary)", textAlign: "center" }}>How would you like to add your room?</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
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
                      padding: "3rem 1.5rem",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      background: "var(--bg-base)",
                      boxShadow: "var(--shadow-sm)",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; }}
                  >
                    <div style={{ background: "var(--bg-surface)", padding: "1rem", borderRadius: "50%", color: "var(--accent)", boxShadow: "var(--shadow-sm)" }}>
                      <Camera size={32} />
                    </div>
                    <div style={{ fontWeight: 600, color: "var(--fg-primary)", fontSize: "1.1rem" }}>Take a photo</div>
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
                      padding: "3rem 1.5rem",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      background: "var(--bg-base)",
                      boxShadow: "var(--shadow-sm)",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; }}
                  >
                    <div style={{ background: "var(--bg-surface)", padding: "1rem", borderRadius: "50%", color: "var(--accent)", boxShadow: "var(--shadow-sm)" }}>
                      <UploadCloud size={32} />
                    </div>
                    <div style={{ fontWeight: 600, color: "var(--fg-primary)", fontSize: "1.1rem" }}>Upload a photo</div>
                  </div>
                </div>

                {/* ── Hints & Prompts Guide for Room Fit ── */}
                <div
                  style={{
                    background: "var(--bg-base)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)",
                    padding: "1.5rem",
                    marginTop: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "1rem",
                      color: "var(--accent)",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                    }}
                  >
                    <Lightbulb size={18} />
                    Tips for Best AI Room Fit Results
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                      gap: "1.25rem",
                    }}
                  >
                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                      <div
                        style={{
                          width: "2.25rem",
                          height: "2.25rem",
                          borderRadius: "var(--radius-sm)",
                          background: "rgba(201,169,110,0.12)",
                          color: "var(--accent)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Maximize2 size={16} />
                      </div>
                      <div>
                        <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--fg-primary)", marginBottom: "0.2rem" }}>
                          Capture Floor & Walls
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "var(--fg-secondary)", lineHeight: 1.5 }}>
                          Stand 6–10 ft back from a doorway or corner to capture both the floor plane and walls for depth calculation.
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                      <div
                        style={{
                          width: "2.25rem",
                          height: "2.25rem",
                          borderRadius: "var(--radius-sm)",
                          background: "rgba(201,169,110,0.12)",
                          color: "var(--accent)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Sun size={16} />
                      </div>
                      <div>
                        <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--fg-primary)", marginBottom: "0.2rem" }}>
                          Good Lighting
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "var(--fg-secondary)", lineHeight: 1.5 }}>
                          Natural daylight or bright room lighting helps AI accurately identify room geometry and furniture materials.
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                      <div
                        style={{
                          width: "2.25rem",
                          height: "2.25rem",
                          borderRadius: "var(--radius-sm)",
                          background: "rgba(201,169,110,0.12)",
                          color: "var(--accent)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Armchair size={16} />
                      </div>
                      <div>
                        <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--fg-primary)", marginBottom: "0.2rem" }}>
                          Show Key Furniture
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "var(--fg-secondary)", lineHeight: 1.5 }}>
                          Keep your main sofa, bed, or desk visible so AI can detect existing items and recommend complementary pieces.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
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
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 600, letterSpacing: "0.05em", fontSize: "1.1rem" }}>
                        <Sparkles size={18} color="var(--accent)" />
                        <span>Analyzing your room</span>
                      </div>
                      <div style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.7)" }}>Reading visual geometry & context...</div>
                    </div>
                  </div>
                )}
              </div>

              {!isPending && (
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <button
                    onClick={handleAnalyze}
                    style={{
                      flex: 1,
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
                    <ScanLine size={18} /> Analyze Room
                  </button>
                  <button
                    onClick={handleClear}
                    style={{
                      flex: 1,
                      padding: "0.875rem 1.5rem",
                      background: "var(--bg-base)",
                      color: "var(--fg-secondary)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-full)",
                      fontSize: "0.9375rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileSelect}
            aria-label="Upload room image"
          />

          {/* Right side instruction when image is selected but not analyzed */}
          {selectedImage && !isPending && (
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", padding: "2rem", background: "var(--bg-base)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--fg-primary)", marginBottom: "1rem" }}>Ready to scan</h3>
              <p style={{ color: "var(--fg-secondary)", lineHeight: 1.6 }}>
                Click &quot;Analyze Room&quot; to let our AI scan the furniture in your photo. We will identify key pieces and suggest complementary items from our catalog to complete your space.
              </p>
            </div>
          )}
          
          {selectedImage && isPending && (
             <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", padding: "2rem" }}>
                <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.25rem", fontWeight: 600, color: "var(--accent-dark)", marginBottom: "1.5rem" }}>
                  <Sparkles size={20} color="var(--accent)" />
                  <span>LIMATA is analyzing your room...</span>
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--fg-primary)", animation: "fadeIn 0.5s ease" }}>
                    <div style={{ width: "1.25rem", height: "1.25rem", borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span>Understanding the room</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--fg-primary)", animation: "fadeIn 0.5s ease 1s both" }}>
                    <div style={{ width: "1.25rem", height: "1.25rem", borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span>Detecting furniture</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--fg-primary)", animation: "fadeIn 0.5s ease 2s both" }}>
                    <div style={{ width: "1.25rem", height: "1.25rem", borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span>Evaluating available space</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--fg-secondary)", animation: "fadeIn 0.5s ease 3s both" }}>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Finding suitable products</span>
                  </div>
                </div>
             </div>
          )}
        </div>
      )}

      {/* Error State */}
      {isError && error && (
        <div 
          aria-live="polite"
          className="animate-fade-in"
          style={{ padding: "2rem", background: "var(--bg-base)", border: "1px solid var(--border-strong)", borderRadius: "var(--radius-lg)", textAlign: "center" }}
        >
          <AlertCircle size={32} color="var(--accent-dark)" style={{ marginBottom: "1rem", marginInline: "auto" }} />
          <h3 style={{ fontSize: "1.125rem", color: "var(--fg-primary)", marginBottom: "0.5rem" }}>
            {error.type === 'validation' ? "Image Analysis Failed" : "Unable to scan"}
          </h3>
          <p style={{ fontSize: "0.9rem", color: "var(--fg-secondary)", marginBottom: "1.5rem" }}>
            {error.message}
          </p>
          <button onClick={handleClear} className="btn-ghost" style={{ padding: "0.5rem 1rem", borderRadius: "var(--radius-full)", fontSize: "0.875rem", fontWeight: 500, cursor: "pointer" }}>Start Over</button>
        </div>
      )}

      {/* Results State */}
      {data && (
        <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
             <div style={{ position: "relative", width: "100%", aspectRatio: "4/3", borderRadius: "var(--radius-lg)", overflow: "hidden", border: "1px solid var(--border)" }}>
               {previewUrl && <Image src={previewUrl} alt="Analyzed Room" fill className="object-cover" />}
               
               {/* Floating Detection Chip */}
               {data.visual_context.detected_class && (
                 <div style={{
                   position: "absolute",
                   top: "1rem",
                   left: "1rem",
                   background: "rgba(28, 26, 23, 0.7)",
                   backdropFilter: "blur(8px)",
                   color: "white",
                   padding: "0.5rem 1rem",
                   borderRadius: "var(--radius-full)",
                   display: "flex",
                   alignItems: "center",
                   gap: "0.5rem",
                   fontSize: "0.875rem",
                   fontWeight: 600,
                   boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                   border: "1px solid rgba(255,255,255,0.1)"
                 }} className="animate-fade-up">
                   <Sparkles size={16} color="var(--accent)" />
                   <span style={{ textTransform: "capitalize" }}>{data.visual_context.detected_class}</span> detected
                 </div>
               )}
             </div>

             <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
               <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", background: "var(--bg-base)", padding: "1.5rem", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)" }}>
                 <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                   <Sparkles size={24} color="var(--accent-dark)" />
                   <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--fg-primary)", margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>LIMATA Understands Your Room</h3>
                 </div>
                 
                 <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    {data.visual_context.detected_class ? (
                      <>
                        <div>
                          <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>Room Understanding</div>
                          <div style={{ fontSize: "0.95rem", color: "var(--fg-secondary)", lineHeight: 1.5 }}>
                            LIMATA identified a <span style={{ textTransform: "lowercase", fontWeight: 500 }}>{data.visual_context.detected_class}</span> in your photo. 
                            Based on the detected furniture, this appears to be a <span style={{ fontWeight: 600, color: "var(--fg-primary)", textTransform: "lowercase" }}>{
                              data.visual_context.detected_class.includes("bed") ? "bedroom" : 
                              data.visual_context.detected_class.includes("table") ? "dining area" : 
                              "living room"
                            } setting</span>.
                          </div>
                        </div>

                        {data.visual_context.space_availability && (
                          <div>
                            <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>Space & Depth Analysis</div>
                            <div style={{ fontSize: "0.95rem", color: "var(--fg-secondary)", lineHeight: 1.5, marginBottom: "0.75rem" }}>
                              LIMATA analyzed the spatial depth of your room and found {
                                data.visual_context.space_availability === "Limited" ? "limited" :
                                data.visual_context.space_availability === "Moderate" ? "a moderate amount of" :
                                "substantial"
                              } open space around the existing furniture.
                            </div>
                            
                            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.35rem 0.75rem", borderRadius: "var(--radius-md)", background: data.visual_context.space_availability === "Limited" ? "rgba(239, 68, 68, 0.1)" : data.visual_context.space_availability === "Moderate" ? "rgba(245, 158, 11, 0.1)" : "rgba(34, 197, 94, 0.1)", color: data.visual_context.space_availability === "Limited" ? "#dc2626" : data.visual_context.space_availability === "Moderate" ? "#d97706" : "#16a34a", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                              Space availability: {data.visual_context.space_availability}
                            </div>
                            
                            <div style={{ fontSize: "0.95rem", color: "var(--fg-secondary)", lineHeight: 1.5 }}>
                              {data.visual_context.space_availability === "Limited" 
                                ? "The current arrangement leaves relatively little usable space for additional large furniture. Compact or space-efficient pieces may work better in this room."
                                : data.visual_context.space_availability === "Moderate"
                                ? "There appears to be a reasonable amount of open space around the existing furniture. Carefully sized furniture should work well."
                                : "LIMATA found substantial open space around the existing furniture, giving you more flexibility when adding furniture."}
                            </div>
                          </div>
                        )}
                      </>
                  ) : (
                    <>
                      <div style={{ fontSize: "0.95rem", color: "var(--fg-secondary)", lineHeight: 1.5 }}>
                        No identifiable furniture found. We couldn&apos;t map specific spatial anchors. Showing general catalog recommendations instead.
                      </div>
                    </>
                  )}
                 </div>
               </div>
               
               {data.visual_context.detected_class && (
                 <div style={{ fontSize: "1rem", color: "var(--fg-primary)", fontWeight: 500, marginTop: "0.5rem", marginBottom: "-0.5rem" }}>
                   Based on your room&apos;s style and space, these options may work well:
                 </div>
               )}
               
               <div style={{ display: "flex", gap: "1rem", alignSelf: "flex-start", flexWrap: "wrap" }}>
                 <button
                   onClick={() => {
                     window.dispatchEvent(
                       new CustomEvent("open-ai-chat", {
                         detail: {
                           context: {
                             detected_objects: data.visual_context.detected_class ? [data.visual_context.detected_class] : [],
                             depth_analysis: { space_availability: data.visual_context.space_availability },
                             recommendations: data.recommended_product_ids.map(id => ({
                               productId: id,
                               match_score: data.matching_info[id]?.score,
                               reasons: data.matching_info[id]?.reasons || []
                             }))
                           }
                         }
                       })
                     );
                   }}
                   style={{
                     padding: "0.6rem 1rem",
                     background: "var(--accent)",
                     color: "#fff",
                     border: "none",
                     borderRadius: "var(--radius-full)",
                     fontSize: "0.875rem",
                     fontWeight: 600,
                     cursor: "pointer",
                     display: "flex",
                     alignItems: "center",
                     gap: "0.5rem"
                   }}
                 >
                   <Sparkles size={16} /> Chat with LIMATA AI
                 </button>
                 <button
                   onClick={handleClear}
                   style={{
                     padding: "0.6rem 1rem",
                     background: "transparent",
                     color: "var(--fg-secondary)",
                     border: "1px solid var(--border)",
                     borderRadius: "var(--radius-full)",
                     fontSize: "0.875rem",
                     fontWeight: 600,
                     cursor: "pointer",
                   }}
                 >
                   Scan Another Room
                 </button>
               </div>
             </div>
          </div>

          <div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--fg-primary)", marginBottom: "1.5rem" }}>
              Suggested For You
            </h3>

            {recommendedProducts.length === 0 ? (
              <div style={{ padding: "3rem", textAlign: "center", background: "var(--bg-base)", borderRadius: "var(--radius-lg)", border: "1px dashed var(--border)" }}>
                <p style={{ color: "var(--fg-secondary)" }}>No matching products found in the current catalog.</p>
              </div>
            ) : (() => {
              // ── Group products by score tier ──────────────────────────────
              type Group = { label: string; color: string; bg: string; border: string; desc: string; items: typeof recommendedProducts };
              const groups: Group[] = [
                { label: "Strong Match",  color: "#b45309", bg: "rgba(251,191,36,0.10)", border: "rgba(251,191,36,0.35)", desc: "Perfectly aligned with your room's style & palette", items: [] },
                { label: "Good Match",    color: "#0e7490", bg: "rgba(6,182,212,0.08)",  border: "rgba(6,182,212,0.30)",  desc: "Solid picks that complement your space well",       items: [] },
                { label: "Complementary", color: "#6b7280", bg: "rgba(156,163,175,0.08)",border: "rgba(156,163,175,0.28)", desc: "Extra options that can work with some styling",     items: [] },
              ];

              recommendedProducts.forEach((p) => {
                const info = data.matching_info[p.productId];
                const score = info?.score ?? 0;
                if (score > 0.8) groups[0].items.push(p);
                else if (score > 0.6) groups[1].items.push(p);
                else groups[2].items.push(p);
              });

              const makeBadge = (p: (typeof recommendedProducts)[number], label: string) => {
                const info = data.matching_info[p.productId];
                if (!info) return null;
                return (
                  <div style={{ background: "rgba(28,26,23,0.9)", backdropFilter: "blur(6px)", padding: "0.75rem", borderRadius: "var(--radius-md)", fontSize: "0.75rem", color: "#fff", display: "flex", flexDirection: "column", gap: "0.5rem", border: "1px solid rgba(255,255,255,0.15)", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
                    <div style={{ fontWeight: 700, color: "var(--accent)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                      <Sparkles size={12} /> {label}
                    </div>
                    <div style={{ fontSize: "0.8rem", fontFamily: "monospace", color: "rgba(255,255,255,0.8)" }}>
                      Match score: {info.score.toFixed(2)}
                    </div>
                    {info.reasons.length > 0 && (
                      <div style={{ color: "rgba(255,255,255,0.9)", lineHeight: 1.4 }}>
                        {info.reasons[0]}
                      </div>
                    )}
                  </div>
                );
              };

              return (
                <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
                  {groups.filter(g => g.items.length > 0).map((group) => {
                    const isStrong = group.label === "Strong Match";
                    return (
                      <div
                        key={group.label}
                        style={isStrong ? {
                          background: "var(--bg-elevated)",
                          border: "1px solid var(--border-strong)",
                          borderRadius: "var(--radius-lg)",
                          padding: "1.5rem",
                          position: "relative",
                          overflow: "hidden",
                          boxShadow: "var(--shadow-sm)",
                        } : {}}
                      >
                        {/* Accent top stripe for Strong Match */}
                        {isStrong && (
                          <div style={{
                            position: "absolute",
                            top: 0, left: 0, right: 0,
                            height: "3px",
                            background: "var(--accent)",
                            borderRadius: "var(--radius-lg) var(--radius-lg) 0 0",
                          }} />
                        )}

                        {/* ── Section header ── */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem", paddingBottom: "0.75rem", borderBottom: `1px solid ${group.border}` }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                              <span style={{ fontSize: "1rem", fontWeight: 700, color: "var(--fg-primary)" }}>{group.label}</span>
                              <span style={{ fontSize: "0.72rem", fontWeight: 700, padding: "0.15rem 0.55rem", borderRadius: "999px", background: group.bg, color: group.color, border: `1px solid ${group.border}`, letterSpacing: "0.03em" }}>
                                {group.items.length} {group.items.length === 1 ? "item" : "items"}
                              </span>
                              {isStrong && (
                                <span style={{ fontSize: "0.68rem", fontWeight: 600, padding: "0.15rem 0.5rem", borderRadius: "999px", background: "var(--accent-light)", color: "var(--accent-dark)", border: "1px solid var(--accent)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                                  Best Picks
                                </span>
                              )}
                            </div>
                            <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--fg-secondary)", marginTop: "0.1rem" }}>{group.desc}</p>
                          </div>
                        </div>

                        {/* ── Product grid ── */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: "1.25rem" }}>
                          {group.items.map((p) => (
                            <ProductCard key={p.productId} product={p} />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
