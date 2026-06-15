"use client";

import { useState } from "react";
import Image from "next/image";

interface ImageUploadProps {
  onChange: (files: File[]) => void;
  initialImages?: string[];
}

export function ImageUpload({ onChange, initialImages = [] }: ImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>(initialImages);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setPreviews([...previews, ...newPreviews]);
    onChange(files);
  }

  function removePreview(index: number) {
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
  }

  return (
    <div>
      <label className="block text-sm font-medium text-slate-950 mb-2">Product Images</label>
      <input type="file" multiple accept="image/*" onChange={handleChange} className="block w-full text-sm" />
      {previews.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {previews.map((src, i) => (
            <div key={i} className="relative">
              <Image
                src={src}
                alt={`preview-${i}`}
                width={80}
                height={80}
                unoptimized
                className="h-20 w-20 object-cover rounded"
              />
              <button
                type="button"
                onClick={() => removePreview(i)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
