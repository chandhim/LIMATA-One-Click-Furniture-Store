"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { UploadCloud, ScanLine, X, AlertCircle, Sparkles, Home } from "lucide-react";
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
                    <div style={{ fontWeight: 600, letterSpacing: "0.05em" }}>ANALYZING ROOM...</div>
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
                <h3 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--accent-dark)", marginBottom: "1rem", animation: "pulse 2s infinite" }}>Scanning visual context...</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div style={{ height: "1rem", background: "var(--border)", borderRadius: "var(--radius-full)", width: "100%", animation: "pulse 1.5s infinite" }} />
                  <div style={{ height: "1rem", background: "var(--border)", borderRadius: "var(--radius-full)", width: "80%", animation: "pulse 1.5s infinite 0.2s" }} />
                  <div style={{ height: "1rem", background: "var(--border)", borderRadius: "var(--radius-full)", width: "90%", animation: "pulse 1.5s infinite 0.4s" }} />
                </div>
             </div>
          )}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div style={{ padding: "2rem", background: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "var(--radius-lg)", textAlign: "center" }}>
          <AlertCircle size={32} color="#ef4444" style={{ marginBottom: "1rem", marginInline: "auto" }} />
          <h3 style={{ fontSize: "1.125rem", color: "var(--fg-primary)", marginBottom: "0.5rem" }}>Analysis Failed</h3>
          <p style={{ fontSize: "0.9rem", color: "var(--fg-secondary)", marginBottom: "1.5rem" }}>There was a problem analyzing your room. Please try a different image or try again later.</p>
          <button onClick={handleClear} style={{ padding: "0.5rem 1rem", border: "1px solid var(--border)", background: "var(--bg-surface)", color: "var(--fg-secondary)", borderRadius: "var(--radius-full)", cursor: "pointer" }}>Start Over</button>
        </div>
      )}

      {/* Results State */}
      {data && (
        <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
             <div style={{ display: "flex", alignItems: "center", gap: "1rem", background: "var(--bg-base)", padding: "1rem 1.5rem", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", flex: 1 }}>
               <Home size={28} color="var(--accent-dark)" />
               <div>
                  {data.visual_context.detected_class ? (
                    <>
                      <div style={{ fontSize: "0.85rem", textTransform: "uppercase", fontWeight: 700, color: "var(--accent)", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>
                        🛋️ We detected: <span style={{ color: "var(--fg-primary)" }}>{data.visual_context.detected_class}</span>
                      </div>
                      <div style={{ fontSize: "1.1rem", color: "var(--fg-secondary)" }}>
                        Based on your <strong style={{ color: "var(--fg-primary)" }}>{data.visual_context.mapped_category}</strong>, here are complementary furniture recommendations.
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: "0.85rem", textTransform: "uppercase", fontWeight: 700, color: "var(--fg-muted)", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>
                        No Identifiable Furniture Found
                      </div>
                      <div style={{ fontSize: "1.1rem", color: "var(--fg-secondary)" }}>
                        We couldn&apos;t identify specific furniture to map. Showing general catalog recommendations.
                      </div>
                    </>
                  )}
               </div>
             </div>
             <button
               onClick={handleClear}
               style={{
                 marginLeft: "1rem",
                 padding: "0.6rem 1rem",
                 background: "transparent",
                 color: "var(--fg-secondary)",
                 border: "1px solid var(--border)",
                 borderRadius: "var(--radius-full)",
                 fontSize: "0.875rem",
                 fontWeight: 600,
                 cursor: "pointer",
                 whiteSpace: "nowrap"
               }}
             >
               Scan Another Room
             </button>
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
                  const badge = info ? (
                     <div style={{ background: "rgba(28,26,23,0.85)", backdropFilter: "blur(6px)", padding: "0.5rem 0.75rem", borderRadius: "var(--radius-md)", fontSize: "0.75rem", color: "#fff", display: "flex", flexDirection: "column", gap: "0.25rem", border: "1px solid rgba(255,255,255,0.15)", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
                       <div style={{ fontWeight: 700, color: "var(--accent)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                         <Sparkles size={12} /> Synergy Score: {info.score}
                       </div>
                       {info.reasons.length > 0 && (
                         <ul style={{ margin: 0, paddingLeft: "1.2rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.4 }}>
                           {info.reasons.map((r: string, i: number) => <li key={i} style={{ marginBottom: "0.1rem" }}>{r}</li>)}
                         </ul>
                       )}
                     </div>
                  ) : null;
        
                  return <ProductCard key={p.productId} product={p} badge={badge} />;
                })}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
