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
      let imageUrls: string[] = [];
      let modelUrl: string | undefined;

      if (newImages.length > 0) {
        const uploadRes = await uploadImages(newImages);
        imageUrls = [...remainingImages, ...uploadRes.urls];
      } else {
        imageUrls = remainingImages;
      }

      if (model) {
        const uploadRes = await uploadModel(model);
        modelUrl = uploadRes.url;
      } else if (product?.model3dUrl) {
        modelUrl = product.model3dUrl;
      }

      const productData = { ...data, images: imageUrls, model3dUrl: modelUrl };

      if (productId) {
        await updateProduct.mutateAsync(productData);
      } else {
        await createProduct.mutateAsync(productData);
      }

      router.push("/admin/products");
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
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

      <style>{`
        @media (max-width: 768px) {
          form > div:first-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </form>
  );
}
