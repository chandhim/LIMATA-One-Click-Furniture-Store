"use client";

export function ProductSkeleton() {
  return (
    <div className="animate-pulse border rounded-md p-3 bg-white">
      <div className="w-full h-48 bg-gray-200 rounded mb-3" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/4" />
    </div>
  );
}
