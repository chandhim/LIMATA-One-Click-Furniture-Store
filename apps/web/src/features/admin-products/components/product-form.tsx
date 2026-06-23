"use client";

import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateProduct } from "../hooks/use-create-product";
import { useUpdateProduct } from "../hooks/use-update-product";
import { useAdminProduct } from "../hooks/use-admin-products";
import { useAdminCategories } from "@/features/admin/hooks/use-admin";
import { uploadImages, uploadModel } from "../services/admin-product.service";
import { ImageUpload } from "./image-upload";
import { ModelUpload } from "./model-upload";
import { useRouter } from "next/navigation";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  stock: z.number().int().min(0, "Stock must be non-negative"),
  category: z.string().min(1, "Category is required"),
  material: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  productId?: string;
  onSuccess?: () => void;
}

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: "0.8rem",
          fontWeight: 600,
          color: "var(--fg-secondary)",
          letterSpacing: "0.04em",
          marginBottom: "0.5rem",
          textTransform: "uppercase",
        }}
      >
        {label}
      </label>
      {children}
      {error && (
        <p
          style={{
            marginTop: "0.375rem",
            fontSize: "0.78rem",
            color: "#c0392b",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

const PRESET_CATEGORIES = [
  "Living Room",
  "Bedroom",
  "Dining Room",
  "Office",
  "Outdoor",
  "Kitchen",
];

const PRESET_MATERIALS = [
  "Solid Oak",
  "Teak Wood",
  "Mahogany",
  "Walnut Wood",
  "Leather",
  "Velvet Fabric",
  "Metal",
  "Glass",
  "Marble",
];

export function ProductForm({ productId, onSuccess }: ProductFormProps) {
  const router = useRouter();
  const { data: product, isLoading: isLoadingProduct } = useAdminProduct(productId || "");
  const { data: dbCategories } = useAdminCategories();
  const CATEGORIES = useMemo(() => Array.from(new Set([...PRESET_CATEGORIES, ...(dbCategories?.map((c: { name: string }) => c.name) || [])])), [dbCategories]);
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct(productId || "");

  const [newImages, setNewImages] = useState<File[]>([]);
  const [remainingImages, setRemainingImages] = useState<string[]>([]);
  const [model, setModel] = useState<File | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState("");
  const [optimizationStats, setOptimizationStats] = useState<any>(null);

  const [selectedCategoryOption, setSelectedCategoryOption] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [selectedMaterialOption, setSelectedMaterialOption] = useState("");
  const [customMaterial, setCustomMaterial] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    trigger,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const preventNegative = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "-" || e.key === "+" || e.key === "e" || e.key === "E") {
      e.preventDefault();
    }
  };

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category,
        material: product.material,
      });

      if (CATEGORIES.includes(product.category)) {
        setSelectedCategoryOption(product.category);
        setCustomCategory("");
      } else {
        setSelectedCategoryOption("custom");
        setCustomCategory(product.category || "");
      }

      if (product.material) {
        if (PRESET_MATERIALS.includes(product.material)) {
          setSelectedMaterialOption(product.material);
          setCustomMaterial("");
        } else {
          setSelectedMaterialOption("custom");
          setCustomMaterial(product.material);
        }
      } else {
        setSelectedMaterialOption("");
        setCustomMaterial("");
      }

      setRemainingImages(product.images || []);
    }
  }, [product, reset, CATEGORIES]);

  useEffect(() => {
    const finalCategory = selectedCategoryOption === "custom" ? customCategory : selectedCategoryOption;
    setValue("category", finalCategory);
    if (finalCategory) {
      void trigger("category");
    }
  }, [selectedCategoryOption, customCategory, setValue, trigger]);

  useEffect(() => {
    const finalMaterial = selectedMaterialOption === "custom" ? customMaterial : selectedMaterialOption;
    setValue("material", finalMaterial || undefined);
  }, [selectedMaterialOption, customMaterial, setValue]);

  async function onSubmit(data: ProductFormData) {
    try {
      setUploadingFiles(true);
      setUploadProgress(0);
      setUploadStage("Starting upload...");
      setOptimizationStats(null);
      let imageUrls: string[] = [];
      let modelUrl: string | undefined;

      if (newImages.length > 0) {
        setUploadStage("Uploading images...");
        const uploadRes = await uploadImages(newImages);
        imageUrls = [...remainingImages, ...uploadRes.urls];
      } else {
        imageUrls = remainingImages;
      }

      if (model) {
        setUploadStage("Uploading GLB...");
        
        let fakeProgressInterval: NodeJS.Timeout | null = null;

        const uploadRes = await uploadModel(model, (progressEvent: any) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            const overallProgress = Math.round(percentCompleted * 0.2); // 0-20%
            setUploadProgress(overallProgress);
            
            if (percentCompleted === 100 && !fakeProgressInterval) {
              setUploadStage("Optimizing 3D Model... this may take a moment.");
              let currentFakeProgress = 20;
              fakeProgressInterval = setInterval(() => {
                currentFakeProgress += Math.random() * 3;
                if (currentFakeProgress > 70 && currentFakeProgress < 90) {
                  setUploadStage("Uploading Optimized GLB To Cloud Storage...");
                }
                if (currentFakeProgress > 95) currentFakeProgress = 95;
                setUploadProgress(Math.round(currentFakeProgress));
              }, 1500);
            }
          }
        });
        
        if (fakeProgressInterval) clearInterval(fakeProgressInterval);
        
        setUploadProgress(95);
        setUploadStage("Finalizing Product...");
        modelUrl = uploadRes.url;
        if (uploadRes.optimizationStats) {
          setOptimizationStats(uploadRes.optimizationStats);
        }
      } else if (product?.model3dUrl) {
        modelUrl = product.model3dUrl;
      }

      const productData = { ...data, images: imageUrls, model3dUrl: modelUrl };

      setUploadProgress(100);
      setUploadStage("Saving to database...");

      if (productId) {
        await updateProduct.mutateAsync(productData);
      } else {
        await createProduct.mutateAsync(productData);
      }

      if (optimizationStats || (model && setOptimizationStats !== null)) {
        // Wait a bit to show stats before redirecting
        setTimeout(() => {
          setUploadingFiles(false);
          router.push("/admin/products");
          onSuccess?.();
        }, 4000);
      } else {
        setUploadingFiles(false);
        router.push("/admin/products");
        onSuccess?.();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setUploadingFiles(false);
    }
  }

  if (productId && isLoadingProduct) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "4rem",
          color: "var(--fg-muted)",
          gap: "0.75rem",
          fontSize: "0.875rem",
        }}
      >
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            border: "2px solid var(--accent)",
            borderTopColor: "transparent",
            animation: "spin 0.7s linear infinite",
          }}
        />
        Loading product...
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const isLoading = isSubmitting || uploadingFiles;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
        }}
      >
        {/* Left column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          {/* Basic info card */}
          <div
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: "1.75rem",
            }}
          >
            <h3
              style={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "var(--fg-primary)",
                marginBottom: "1.25rem",
                paddingBottom: "0.875rem",
                borderBottom: "1px solid var(--border)",
              }}
            >
              Basic Information
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}>
              <FormField label="Product Name" error={errors.name?.message}>
                <input
                  {...register("name")}
                  type="text"
                  className="input-base"
                  placeholder="e.g. Modern Lounge Sofa"
                />
              </FormField>

              <FormField label="Description" error={errors.description?.message}>
                <textarea
                  {...register("description")}
                  className="input-base"
                  rows={4}
                  placeholder="Describe the product..."
                  style={{ resize: "vertical" }}
                />
              </FormField>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <FormField label="Category" error={errors.category?.message}>
                  <select
                    value={selectedCategoryOption}
                    onChange={(e) => setSelectedCategoryOption(e.target.value)}
                    className="input-base"
                    style={{ background: "transparent", color: "var(--fg-primary)", width: "100%" }}
                  >
                    <option value="">Select Category</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="custom">Other (Specify...)</option>
                  </select>
                  {selectedCategoryOption === "custom" && (
                    <input
                      type="text"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      className="input-base"
                      placeholder="Enter custom category"
                      style={{ marginTop: "0.5rem", width: "100%" }}
                    />
                  )}
                </FormField>
                <FormField label="Material" error={errors.material?.message}>
                  <select
                    value={selectedMaterialOption}
                    onChange={(e) => setSelectedMaterialOption(e.target.value)}
                    className="input-base"
                    style={{ background: "transparent", color: "var(--fg-primary)", width: "100%" }}
                  >
                    <option value="">Select Material</option>
                    {PRESET_MATERIALS.map((mat) => (
                      <option key={mat} value={mat}>{mat}</option>
                    ))}
                    <option value="custom">Other (Specify...)</option>
                  </select>
                  {selectedMaterialOption === "custom" && (
                    <input
                      type="text"
                      value={customMaterial}
                      onChange={(e) => setCustomMaterial(e.target.value)}
                      className="input-base"
                      placeholder="Enter custom material"
                      style={{ marginTop: "0.5rem", width: "100%" }}
                    />
                  )}
                </FormField>
              </div>
            </div>
          </div>

          {/* Pricing & inventory card */}
          <div
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: "1.75rem",
            }}
          >
            <h3
              style={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "var(--fg-primary)",
                marginBottom: "1.25rem",
                paddingBottom: "0.875rem",
                borderBottom: "1px solid var(--border)",
              }}
            >
              Pricing & Inventory
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <FormField label="Price (Rs.)" error={errors.price?.message}>
                <input
                  {...register("price", { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  min="0.01"
                  onKeyDown={preventNegative}
                  className="input-base"
                  placeholder="0.00"
                />
              </FormField>
              <FormField label="Stock Quantity" error={errors.stock?.message}>
                <input
                  {...register("stock", { valueAsNumber: true })}
                  type="number"
                  min="0"
                  onKeyDown={preventNegative}
                  className="input-base"
                  placeholder="0"
                />
              </FormField>
            </div>
          </div>
        </div>

        {/* Right column — media */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: "1.75rem",
            }}
          >
            <h3
              style={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "var(--fg-primary)",
                marginBottom: "1.25rem",
                paddingBottom: "0.875rem",
                borderBottom: "1px solid var(--border)",
              }}
            >
              Product Images
            </h3>
            <ImageUpload
              onChange={(newFiles, remainingUrls) => {
                setNewImages(newFiles);
                setRemainingImages(remainingUrls);
              }}
              initialImages={product?.images}
            />
          </div>

          <div
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: "1.75rem",
            }}
          >
            <h3
              style={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "var(--fg-primary)",
                marginBottom: "1.25rem",
                paddingBottom: "0.875rem",
                borderBottom: "1px solid var(--border)",
              }}
            >
              3D Model (GLB)
            </h3>
            <ModelUpload onChange={setModel} initialUrl={product?.model3dUrl} />
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div
        style={{
          marginTop: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.875rem",
          padding: "1.25rem 1.75rem",
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
        }}
      >
        <button
          type="submit"
          disabled={isLoading}
          className="btn-shimmer"
          style={{
            padding: "0.75rem 2rem",
            fontSize: "0.9rem",
            fontWeight: 600,
            color: "var(--fg-primary)",
            border: "none",
            borderRadius: "var(--radius-full)",
            cursor: isLoading ? "not-allowed" : "pointer",
            opacity: isLoading ? 0.7 : 1,
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          {isLoading && (
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                border: "2px solid rgba(0,0,0,0.2)",
                borderTopColor: "var(--fg-primary)",
                display: "inline-block",
                animation: "spin 0.7s linear infinite",
              }}
            />
          )}
          {isLoading ? "Saving..." : productId ? "Update Product" : "Create Product"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "0.9rem",
            fontWeight: 500,
            color: "var(--fg-secondary)",
            background: "transparent",
            border: "1.5px solid var(--border)",
            borderRadius: "var(--radius-full)",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = "var(--border-strong)";
            el.style.color = "var(--fg-primary)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = "var(--border)";
            el.style.color = "var(--fg-secondary)";
          }}
        >
          Cancel
        </button>
      </div>

      {/* Progress Overlay */}
      {uploadingFiles && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.8)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
           <div style={{
             background: "var(--bg-surface)",
             padding: "2.5rem",
             borderRadius: "var(--radius-lg)",
             width: "100%",
             maxWidth: "450px",
             boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
             border: "1px solid var(--border)"
           }}>
             <h3 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--fg-primary)", marginBottom: "1.5rem" }}>
               {optimizationStats ? "Product Saved Successfully" : "3D Model Upload"}
             </h3>
             
             {optimizationStats ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                   <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#27ae60", fontWeight: 500, marginBottom: "0.5rem" }}>
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                     3D model optimized successfully
                   </div>
                   <div style={{ display: "flex", justifyContent: "space-between", color: "var(--fg-secondary)", fontSize: "0.9rem" }}>
                     <span>Original Size:</span>
                     <span style={{ fontWeight: 500, color: "var(--fg-primary)" }}>{(optimizationStats.originalSize / 1024 / 1024).toFixed(2)}MB</span>
                   </div>
                   <div style={{ display: "flex", justifyContent: "space-between", color: "var(--fg-secondary)", fontSize: "0.9rem" }}>
                     <span>Optimized Size:</span>
                     <span style={{ fontWeight: 500, color: "var(--fg-primary)" }}>{(optimizationStats.optimizedSize / 1024 / 1024).toFixed(2)}MB</span>
                   </div>
                   <div style={{ display: "flex", justifyContent: "space-between", color: "var(--fg-secondary)", fontSize: "0.9rem" }}>
                     <span>Compression:</span>
                     <span style={{ fontWeight: 600, color: "#27ae60" }}>{optimizationStats.reductionPercentage}%</span>
                   </div>
                   <p style={{ marginTop: "1rem", fontSize: "0.85rem", color: "var(--fg-muted)", textAlign: "center" }}>
                     Redirecting...
                   </p>
                </div>
             ) : (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: 500, color: "var(--fg-primary)" }}>
                    <span>{uploadStage}</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div style={{ width: "100%", background: "var(--bg-elevated)", height: 8, borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ 
                      width: `${uploadProgress}%`, 
                      background: "var(--accent)", 
                      height: "100%", 
                      borderRadius: 4, 
                      transition: "width 0.4s ease" 
                    }} />
                  </div>
                  <p style={{ marginTop: "1.5rem", fontSize: "0.85rem", color: "var(--fg-muted)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    Please do not close this window.
                  </p>
                </div>
             )}
           </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          form > div:first-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </form>
  );
}
