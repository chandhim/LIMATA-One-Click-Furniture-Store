"use client";

import { ProductCard } from "@/features/products/components/product-card";

const samples = [
  { id: "1", name: "Modern Sofa", price: 45000, category: "Living Room", images: ["/images/sofa1.svg"], stock: 10 },
  { id: "2", name: "Wooden Dining Table", price: 30000, category: "Dining Room", images: ["/images/dining1.svg"], stock: 5 },
  { id: "3", name: "Office Chair", price: 8000, category: "Office", images: ["/images/chair1.svg"], stock: 20 },
  { id: "4", name: "Queen Bed", price: 40000, category: "Bedroom", images: ["/images/bed1.svg"], stock: 3 },
];

export function FeaturedProducts() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">Featured Products</h2>
          <a href="/products" className="text-sm text-slate-700">View all</a>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {samples.map((p) => (
            // @ts-ignore
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
