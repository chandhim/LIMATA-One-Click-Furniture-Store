"use client";

export function ProductEmpty() {
  return (
    <div className="p-6 text-center text-gray-600">
      <div className="text-lg font-semibold">No products found.</div>
      <div className="mt-2">Try adjusting your search or filters.</div>
    </div>
  );
}
