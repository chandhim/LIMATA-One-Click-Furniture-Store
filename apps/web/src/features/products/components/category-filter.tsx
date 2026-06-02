"use client";

import { useState } from "react";

const options = ["All", "Sofas", "Beds", "Tables", "Chairs", "Storage"];

export function CategoryFilter({ onSelect }: { onSelect: (category?: string) => void }) {
  const [selected, setSelected] = useState<string>("All");

  function change(cat: string) {
    setSelected(cat);
    onSelect(cat === "All" ? undefined : cat);
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => change(opt)}
          className={`px-3 py-1 rounded ${selected === opt ? "bg-gray-800 text-white" : "bg-gray-100"}`}>
          {opt}
        </button>
      ))}
    </div>
  );
}
