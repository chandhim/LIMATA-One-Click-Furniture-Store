"use client";

import { useRouter } from "next/navigation";

export function ProductError({ message }: { message?: string }) {
  const router = useRouter();

  return (
    <div className="p-6 text-center text-red-600">
      <div className="text-lg font-semibold">Product not found.</div>
      {message && <div className="mt-2 text-sm text-red-400">{message}</div>}
      <div className="mt-4">
        <button
          onClick={() => router.push("/products")}
          className="px-4 py-2 bg-gray-800 text-white rounded"
        >
          Back to products
        </button>
      </div>
    </div>
  );
}
