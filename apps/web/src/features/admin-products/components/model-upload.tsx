"use client";

import { useState } from "react";

interface ModelUploadProps {
  onChange: (file: File | null) => void;
  initialUrl?: string;
}

export function ModelUpload({ onChange, initialUrl }: ModelUploadProps) {
  const [fileName, setFileName] = useState<string | null>(initialUrl ? "Existing model" : null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith(".glb")) {
        alert("Only .glb files are allowed");
        return;
      }
      setFileName(file.name);
      onChange(file);
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-slate-950 mb-2">3D Model (.glb)</label>
      <input type="file" accept=".glb" onChange={handleChange} className="block w-full text-sm" />
      {fileName && <p className="mt-2 text-sm text-slate-600">Selected: {fileName}</p>}
    </div>
  );
}
