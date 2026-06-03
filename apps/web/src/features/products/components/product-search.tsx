"use client";

import { useState } from "react";

export function ProductSearch({ onSearch }: { onSearch: (q: string) => void }) {
  const [q, setQ] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onSearch(q);
  }

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search furniture..."
        className="border rounded px-3 py-2 flex-1"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Search
      </button>
    </form>
  );
}
