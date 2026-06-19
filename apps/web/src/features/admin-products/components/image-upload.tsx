"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { UploadCloud, X } from "lucide-react";

interface ImageUploadProps {
  onChange: (files: File[], remainingInitialUrls: string[]) => void;
  initialImages?: string[];
}

interface ImageItem {
  id: string;
  src: string;
  file?: File;
}

export function ImageUpload({ onChange, initialImages = [] }: ImageUploadProps) {
  const [items, setItems] = useState<ImageItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync initialImages into state when the component mounts/receives new values
  useEffect(() => {
    setItems((prevItems) => {
      // Keep only newly uploaded items that are not in the new initialImages array
      const newUploadedItems = prevItems.filter((item) => item.file !== undefined);
      const mappedInitial = initialImages.map((url) => ({
        id: url,
        src: url,
      }));
      return [...mappedInitial, ...newUploadedItems];
    });
  }, [initialImages]);

  function triggerChange(currentItems: ImageItem[]) {
    const newFiles = currentItems
      .filter((item) => item.file !== undefined)
      .map((item) => item.file!);
    const remainingUrls = currentItems
      .filter((item) => item.file === undefined)
      .map((item) => item.src);
    onChange(newFiles, remainingUrls);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const newItems: ImageItem[] = files.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      src: URL.createObjectURL(file),
      file,
    }));
    const updatedItems = [...items, ...newItems];
    setItems(updatedItems);
    triggerChange(updatedItems);
    
    // Clear the input value so that selecting the same files again still triggers onChange
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function removePreview(id: string) {
    const itemToRemove = items.find((item) => item.id === id);
    if (itemToRemove?.file) {
      URL.revokeObjectURL(itemToRemove.src);
    }
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
    triggerChange(updatedItems);
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

      {items.length > 0 && (
        <div style={{ marginTop: "1rem", display: "flex", flexWrap: "wrap", gap: "0.625rem" }}>
          {items.map((item) => (
            <div 
              key={item.id} 
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
                src={item.src}
                alt="Product preview"
                fill
                unoptimized
                style={{ objectFit: "cover" }}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removePreview(item.id);
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
