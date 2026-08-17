"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { UploadCloud, ScanLine, X, AlertCircle, Sparkles, Home, ChevronDown, ChevronUp, MessageSquare, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useVisualRecommend } from "../hooks/use-visual-recommend";
import { ProductCard } from "@/features/products/components/product-card";
import type { ProductSummary } from "@/features/products/types/product.types";

export function VisualRecommendPanel({
  allProducts,
  onClose,
}: {
  allProducts: ProductSummary[];
  onClose: () => void;
}) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDemoModeOpen, setIsDemoModeOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: analyzeRoom, isPending, data, isError, reset } = useVisualRecommend();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleAnalyze = () => {
    if (!selectedImage) return;
    analyzeRoom(
      { image: selectedImage },
      {
        onError: () => {
          toast.error("Failed to analyze room. Please try again.");
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

  const handleDiscussWithAI = () => {
    // We can dispatch a custom event to tell the AiChatWidget to open, 
    // or rely on a global state. The prompt said to reuse the existing chatbot 
    // cleanly. Since we don't have access to the chat widget's state directly here,
    // we can use a custom window event or modify the URL hash.
    // A clean way is dispatching a CustomEvent that a listener in MainLayout or AiChatWidget can catch.
    window.dispatchEvent(new CustomEvent("OPEN_AI_CHAT", { 
      detail: { 
        presetMessage: `I just scanned my room and it detected a ${data?.visual_context.detected_class}. Can you help me choose between the recommended products?` 
      }
    }));
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        background: "var(--bg-surface)",
        borderRadius: "var(--radius-xl)",
        border: "1px solid var(--border)",
        padding: "2rem",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.5rem", fontWeight: 700, color: "var(--fg-primary)", marginBottom: "0.5rem" }}>
            <Sparkles size={24} color="var(--accent)" />
            Shop This Room
          </h2>
          <p style={{ fontSize: "0.95rem", color: "var(--fg-secondary)", maxWidth: "600px" }}>
            Upload a photo of your room and we&apos;ll suggest furniture that complements what you already have.
          </p>
        </div>
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
      </div>

      {/* Input or Result Split */}
      {!data && !isError && (
        <div style={{ display: "grid", gridTemplateColumns: selectedImage ? "1fr 1fr" : "1fr", gap: "2rem", alignItems: "start" }}>
          
          {/* Upload Area */}
          {!selectedImage ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem",
                border: "2px dashed var(--border-strong)",
                borderRadius: "var(--radius-lg)",
                padding: "4rem 2rem",
                cursor: "pointer",
                transition: "background 0.2s",
                background: "rgba(0,0,0,0.02)",
                minHeight: "300px",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-base)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.02)")}
            >
              <div style={{ background: "var(--bg-base)", padding: "1rem", borderRadius: "50%", color: "var(--accent-dark)", boxShadow: "var(--shadow-sm)" }}>
                <UploadCloud size={32} />
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontWeight: 600, color: "var(--fg-primary)", marginBottom: "0.25rem", fontSize: "1.1rem" }}>Click to upload a room photo</div>
                <div style={{ fontSize: "0.875rem", color: "var(--fg-muted)" }}>Supports JPG, PNG, WEBP</div>
              </div>
            </div>
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
                      <div style={{ fontWeight: 600, letterSpacing: "0.05em", fontSize: "1.1rem" }}>✨ Analyzing your room</div>
                      <div style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.7)" }}>Reading visual geometry & context...</div>
                    </div>
                  </div>
                )}
              </div>

              {!isPending && (
                <div style={{ display: "flex", gap: "1rem" }}>
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
                <h3 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--accent-dark)", marginBottom: "1.5rem" }}>
                  ✨ LIMATA is analyzing your room...
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--fg-primary)", animation: "fadeIn 0.5s ease" }}>
                    <div style={{ width: "1.25rem", height: "1.25rem", borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.75rem" }}>✓</div>
                    <span>Understanding the room</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--fg-primary)", animation: "fadeIn 0.5s ease 1s both" }}>
                    <div style={{ width: "1.25rem", height: "1.25rem", borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.75rem" }}>✓</div>
                    <span>Detecting furniture</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--fg-primary)", animation: "fadeIn 0.5s ease 2s both" }}>
                    <div style={{ width: "1.25rem", height: "1.25rem", borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.75rem" }}>✓</div>
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
      {isError && (
        <div style={{ padding: "2rem", background: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "var(--radius-lg)", textAlign: "center" }}>
          <AlertCircle size={32} color="#ef4444" style={{ marginBottom: "1rem", marginInline: "auto" }} />
          <h3 style={{ fontSize: "1.125rem", color: "var(--fg-primary)", marginBottom: "0.5rem" }}>No furniture could be confidently identified</h3>
          <p style={{ fontSize: "0.9rem", color: "var(--fg-secondary)", marginBottom: "1.5rem" }}>Try uploading a clearer room photo with a wider view so our AI can see the space.</p>
          <button onClick={handleClear} style={{ padding: "0.5rem 1rem", border: "1px solid var(--border)", background: "var(--bg-surface)", color: "var(--fg-secondary)", borderRadius: "var(--radius-full)", cursor: "pointer" }}>Start Over</button>
        </div>
      )}

      {/* Results State */}
      {data && (
        <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "start" }}>
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
                          <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--fg-muted)", textTransform: "uppercase", marginBottom: "0.25rem" }}>👁️ What we saw</div>
                          <div style={{ fontSize: "0.95rem", color: "var(--fg-secondary)", lineHeight: 1.5 }}>
                            We identified a <span style={{ fontWeight: 600, color: "var(--fg-primary)", textTransform: "capitalize" }}>{data.visual_context.detected_class}</span> {data.visual_context.confidence && data.visual_context.confidence > 0.6 && <span style={{ fontSize: "0.8rem", background: "var(--bg-elevated)", padding: "0.1rem 0.4rem", borderRadius: "var(--radius-sm)" }}>High confidence</span>} in what appears to be a <span style={{ fontWeight: 600, color: "var(--fg-primary)", textTransform: "lowercase" }}>{
                              data.visual_context.detected_class.includes("bed") ? "bedroom" : 
                              data.visual_context.detected_class.includes("table") ? "dining area" : 
                              "living room"
                            } setting</span>.
                          </div>
                        </div>

                        <div>
                          <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--fg-muted)", textTransform: "uppercase", marginBottom: "0.25rem" }}>📐 Space & Depth</div>
                          <div style={{ fontSize: "0.95rem", color: "var(--fg-secondary)", lineHeight: 1.5 }}>
                            By analyzing the visual depth of your photo, LIMATA mapped the available floor space to understand where additional furniture might fit.
                          </div>
                        </div>
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
                   alignSelf: "flex-start"
                 }}
               >
                 Scan Another Room
               </button>
             </div>
          </div>

          <div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--fg-primary)", marginBottom: "1.25rem" }}>
              Suggested For You
            </h3>
            
            {recommendedProducts.length === 0 ? (
              <div style={{ padding: "3rem", textAlign: "center", background: "var(--bg-base)", borderRadius: "var(--radius-lg)", border: "1px dashed var(--border)" }}>
                <p style={{ color: "var(--fg-secondary)" }}>No matching products found in the current catalog.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1.25rem" }}>
                {recommendedProducts.map((p) => {
                  const info = data.matching_info[p.productId];
                  let matchLabel = "Good Match";
                  if (info) {
                    if (info.score > 0.8) matchLabel = "Strong Match";
                    else if (info.score > 0.6) matchLabel = "Good Match";
                    else matchLabel = "Complementary";
                  }

                  const badge = info ? (
                     <div style={{ background: "rgba(28,26,23,0.85)", backdropFilter: "blur(6px)", padding: "0.75rem", borderRadius: "var(--radius-md)", fontSize: "0.75rem", color: "#fff", display: "flex", flexDirection: "column", gap: "0.5rem", border: "1px solid rgba(255,255,255,0.15)", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
                       <div style={{ fontWeight: 700, color: "var(--accent)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                         <Sparkles size={12} /> {matchLabel}
                       </div>
                       {info.reasons.length > 0 && (
                         <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                           <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Why we recommend this:</div>
                           <ul style={{ margin: 0, paddingLeft: "1.2rem", color: "rgba(255,255,255,0.9)", lineHeight: 1.4 }}>
                             {info.reasons.map((r: string, i: number) => <li key={i} style={{ marginBottom: "0.1rem" }}>{r}</li>)}
                           </ul>
                         </div>
                       )}
                     </div>
                  ) : null;
        
                  return <ProductCard key={p.productId} product={p} badge={badge} />;
                })}
              </div>
            )}

            {/* AI Assistant Integration */}
            {recommendedProducts.length > 0 && (
              <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center" }}>
                <button
                  onClick={handleDiscussWithAI}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "var(--radius-full)",
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-strong)",
                    color: "var(--fg-primary)",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    boxShadow: "var(--shadow-sm)"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent-dark)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.color = "var(--fg-primary)"; }}
                >
                  <MessageSquare size={18} /> Discuss these options with LIMATA AI
                </button>
              </div>
            )}

            {/* Supervisor Demonstration Accordion */}
            <div style={{ marginTop: "3rem", borderTop: "1px solid var(--border)", paddingTop: "1.5rem" }}>
              <button
                onClick={() => setIsDemoModeOpen(!isDemoModeOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "0.5rem 0",
                  color: "var(--fg-secondary)",
                  fontSize: "0.875rem",
                  fontWeight: 600
                }}
              >
                <span>How LIMATA analyzed your room (Supervisor Demo Mode)</span>
                {isDemoModeOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              
                {isDemoModeOpen && (
                  <div className="animate-fade-in" style={{ marginTop: "1rem", padding: "1.5rem", background: "var(--bg-elevated)", borderRadius: "var(--radius-md)", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    <div>
                      <div style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700, color: "var(--accent-dark)", marginBottom: "0.25rem" }}>🧠 1. Environmental Understanding</div>
                      <div style={{ fontSize: "0.875rem", color: "var(--fg-secondary)" }}>
                        YOLOv8 vision model detected a <strong style={{ color: "var(--fg-primary)" }}>{data.visual_context.detected_class || "null"}</strong> with <strong style={{ color: "var(--fg-primary)" }}>{data.visual_context.confidence ? Math.round(data.visual_context.confidence * 100) : "N/A"}%</strong> confidence.
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700, color: "var(--accent-dark)", marginBottom: "0.25rem" }}>📐 2. Depth Estimation</div>
                      <div style={{ fontSize: "0.875rem", color: "var(--fg-secondary)" }}>
                        MiDaS monocular depth estimation analyzed relative scene depth.
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700, color: "var(--accent-dark)", marginBottom: "0.25rem" }}>🎯 3. Placement Evaluation</div>
                      <div style={{ fontSize: "0.875rem", color: "var(--fg-secondary)" }}>
                        The heuristic engine evaluated orientation and space based on the detected layout.
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700, color: "var(--accent-dark)", marginBottom: "0.25rem" }}>🛍 4. Recommendation Pipeline</div>
                      <div style={{ fontSize: "0.875rem", color: "var(--fg-secondary)" }}>
                        Products matched using hybrid semantic similarity based on the catalog mapping: <strong style={{ color: "var(--fg-primary)" }}>{data.visual_context.mapped_category || "null"}</strong>.
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
