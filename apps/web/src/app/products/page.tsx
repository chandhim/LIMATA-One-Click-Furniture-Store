"use client";

import { useState } from "react";
import { useProducts } from "@/features/products/hooks/use-products";
import { ProductGrid } from "@/features/products/components/product-grid";
import { ProductSearch } from "@/features/products/components/product-search";
import { CategoryFilter } from "@/features/products/components/category-filter";
import { ProductSkeleton } from "@/features/products/components/product-skeleton";
import { ProductEmpty } from "@/features/products/components/product-empty";

export default function ProductsPage() {
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [category, setCategory] = useState<string | undefined>(undefined);

  const { data, isLoading, isError } = useProducts(search, category);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <ProductSearch onSearch={(q) => setSearch(q || undefined)} />
        </div>
        <div>
          <CategoryFilter onSelect={(c) => setCategory(c)} />
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            // @ts-ignore
            <ProductSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && <div className="text-red-600">Unable to load products.</div>}

      {!isLoading && data?.length === 0 && <ProductEmpty />}

      {!isLoading && data && data.length > 0 && <ProductGrid products={data} />}
    </div>
  );
}
