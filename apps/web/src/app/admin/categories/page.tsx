"use client";

import { useState, useRef } from "react";
import {
  useAdminCategories,
  useCreateCategory,
  useDeleteCategory,
} from "@/features/admin/hooks/use-admin";
import { uploadImages } from "@/features/admin-products/services/admin-product.service";
import Image from "next/image";
import { Edit, UploadCloud, FolderPlus, Folder, Trash2 } from "lucide-react";

interface AdminCategory {
  categoryId: string;
  name: string;
  desc: string;
  image?: string;
}

export default function AdminCategoriesPage() {
  const { data: categories = [], isLoading } = useAdminCategories();
  const createCategoryMutation = useCreateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const res = await uploadImages([file]);
      if (res.urls?.[0]) {
        setImageUrl(res.urls[0]);
      }
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !desc) return;

    try {
      await createCategoryMutation.mutateAsync({
        name,
        desc,
        image: imageUrl || undefined,
        alt: name,
      });

      // Reset
      setName("");
      setDesc("");
      setImageUrl("");
    } catch (err) {
      console.error("Failed to create category:", err);
    }
  }

  async function handleEdit(categoryId: string) {
    const cat = categories.find((c: AdminCategory) => c.categoryId === categoryId);
    alert("Edit functionality coming soon for category " + categoryId);
  }

  async function handleDelete(categoryId: string) {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategoryMutation.mutateAsync(categoryId);
      } catch (err) {
        console.error("Failed to delete category:", err);
      }
    }
  }

  if (isLoading) {
    return (
      <div
        style={{
          padding: "4rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80vh",
          color: "var(--fg-muted)",
          gap: "0.75rem",
          background: "var(--bg-base)",
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
        <span>Loading categories...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 64px)",
        padding: "1.5rem 2rem",
        maxWidth: 1400,
        margin: "0 auto",
        background: "var(--bg-base)",
        overflow: "hidden",
      }}
    >
      <div
        className="categories-grid"
        style={{ alignItems: "stretch", flex: 1, minHeight: 0 }}
      >
        {/* Create Category Form Pane */}
        <div
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "1.75rem",
            boxShadow: "var(--shadow-sm)",
            overflowY: "auto",
            height: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "1.25rem",
              paddingBottom: "0.875rem",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <FolderPlus size={16} style={{ color: "var(--accent)" }} />
            <h3
              style={{
                fontSize: "0.875rem",
                fontWeight: 700,
                color: "var(--fg-primary)",
                margin: 0,
              }}
            >
              Create New Category
            </h3>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "var(--fg-secondary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "0.5rem",
                }}
              >
                Category Name
              </label>
              <input
                type="text"
                className="input-base"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Living Room, Bedroom"
                required
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "var(--fg-secondary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "0.5rem",
                }}
              >
                Description
              </label>
              <textarea
                className="input-base"
                rows={3}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Describe this category's primary style..."
                required
                style={{ resize: "vertical" }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "var(--fg-secondary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "0.5rem",
                }}
              >
                Banner Photograph
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                style={{ display: "none" }}
                accept="image/*"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: "2px dashed var(--border-strong)",
                  borderRadius: "var(--radius-md)",
                  padding: "1.5rem",
                  textAlign: "center",
                  cursor: "pointer",
                  background: "var(--bg-elevated)",
                  minHeight: 120,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.25s ease",
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
                {uploading ? (
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--fg-muted)",
                      fontWeight: 500,
                    }}
                  >
                    Uploading image...
                  </span>
                ) : imageUrl ? (
                  <div
                    style={{ position: "relative", width: "100%", height: 70 }}
                  >
                    <Image
                      src={imageUrl}
                      alt="Category preview"
                      fill
                      style={{
                        objectFit: "cover",
                        borderRadius: "var(--radius-sm)",
                      }}
                      unoptimized
                    />
                  </div>
                ) : (
                  <>
                    <UploadCloud
                      size={24}
                      style={{ color: "var(--fg-muted)", opacity: 0.7 }}
                    />
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--fg-secondary)",
                        fontWeight: 500,
                      }}
                    >
                      Upload banner cover
                    </span>
                    <span
                      style={{ fontSize: "0.68rem", color: "var(--fg-muted)" }}
                    >
                      Supports PNG, JPG, WebP
                    </span>
                  </>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={createCategoryMutation.isPending || uploading}
              className="btn-shimmer"
              style={{
                width: "100%",
                padding: "0.75rem",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "var(--fg-primary)",
                border: "none",
                borderRadius: "var(--radius-full)",
                cursor:
                  createCategoryMutation.isPending || uploading
                    ? "not-allowed"
                    : "pointer",
                marginTop: "0.5rem",
              }}
            >
              {createCategoryMutation.isPending
                ? "Creating Category..."
                : "Add Category"}
            </button>
          </form>
        </div>

        {/* Categories List Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.25rem",
            overflowY: "auto",
            height: "100%",
            paddingBottom: "2rem",
            alignContent: "start",
            paddingRight: "0.5rem",
          }}
        >
          {categories.length === 0 ? (
            <div
              style={{
                gridColumn: "span 2",
                padding: "5rem",
                textAlign: "center",
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                color: "var(--fg-muted)",
                fontSize: "0.875rem",
              }}
            >
              <Folder
                size={32}
                style={{
                  color: "var(--fg-muted)",
                  opacity: 0.3,
                  marginBottom: "1rem",
                }}
              />
              <p style={{ margin: 0, fontWeight: 500 }}>
                No categories created yet.
              </p>
              <p style={{ margin: "0.25rem 0 0", fontSize: "0.78rem" }}>
                Fill out the form to add your first collection category.
              </p>
            </div>
          ) : (
            categories.map((cat: AdminCategory) => (
              <div
                key={cat.categoryId}
                className="card animate-fade-up"
                style={{
                  height: "320px",
                  borderRadius: "var(--radius-xl)",
                  overflow: "hidden",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  cursor: "default",
                  transition:
                    "transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "translateY(-6px)";
                  el.style.boxShadow = "var(--shadow-lg)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "none";
                }}
              >
                {/* Photorealistic room background image from R2 */}
                <Image
                  src={cat.image || "/images/hero.svg"}
                  alt={cat.name || "Category"}
                  fill
                  sizes="(max-width: 768px) 80vw, 280px"
                  style={{
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                  unoptimized={!cat.image}
                />

                {/* Bottom gradient overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(8,5,3,0.85) 0%, rgba(8,5,3,0.3) 50%, rgba(8,5,3,0.1) 100%)",
                    pointerEvents: "none",
                  }}
                />

                {/* Delete Button - Top Right Floating */}
                <button
                  onClick={() => handleDelete(cat.categoryId)}
                  style={{
                    position: "absolute",
                    top: "1rem",
                    right: "1rem",
                    padding: "0.5rem 0.75rem",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.9)",
                    background: "rgba(220,50,50,0.85)",
                    border: "none",
                    borderRadius: "var(--radius-md)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.375rem",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    transition: "all 0.2s ease",
                    zIndex: 10,
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = "scale(1.05)";
                    el.style.background = "rgba(220,30,30,1)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = "scale(1)";
                    el.style.background = "rgba(220,50,50,0.85)";
                  }}
                >
                  <Trash2 size={13} />
                  Delete
                </button>

                {/* Text content */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "1.5rem",
                    pointerEvents: "none",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "1.25rem",
                      fontWeight: 600,
                      color: "#FAF9F7",
                      letterSpacing: "-0.01em",
                      lineHeight: 1.2,
                      marginBottom: "0.375rem",
                    }}
                  >
                    {cat.name}
                  </div>
                  <div
                    style={{
                      fontSize: "0.78rem",
                      color: "rgba(250,249,247,0.7)",
                      lineHeight: 1.4,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {cat.desc}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        .categories-grid {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 2.25rem;
        }
        @media (max-width: 992px) {
          .categories-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
