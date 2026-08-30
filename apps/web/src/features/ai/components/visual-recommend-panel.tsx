"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { UploadCloud, ScanLine, X, AlertCircle, Sparkles, MessageSquare, Loader2, Camera } from "lucide-react";
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
  onClose: () => void;
}) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: analyzeRoom, isPending, data, isError, reset } = useVisualRecommend();
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
                     <div style={{ background: "rgba(28,26,23,0.9)", backdropFilter: "blur(6px)", padding: "0.75rem", borderRadius: "var(--radius-md)", fontSize: "0.75rem", color: "#fff", display: "flex", flexDirection: "column", gap: "0.5rem", border: "1px solid rgba(255,255,255,0.15)", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
                       <div style={{ fontWeight: 700, color: "var(--accent)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                         <Sparkles size={12} /> {matchLabel}
                       </div>
                       <div style={{ fontSize: "0.8rem", fontFamily: "monospace", color: "rgba(255,255,255,0.8)" }}>
                         Match score: {info.score.toFixed(2)}
                       </div>
                       {info.reasons.length > 0 && (
                         <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", marginTop: "0.25rem" }}>
                           <div style={{ color: "rgba(255,255,255,0.9)", lineHeight: 1.4 }}>
                             {info.reasons[0]}
                           </div>
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


          </div>
        </div>
      )}
    </div>
  );
}
