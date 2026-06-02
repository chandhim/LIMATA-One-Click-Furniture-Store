"use client";

import Image from "next/image";

const categories = [
  { name: "Living Room", img: "/images/category-living.svg" },
  { name: "Bedroom", img: "/images/category-bedroom.svg" },
  { name: "Dining Room", img: "/images/category-dining.svg" },
  { name: "Office", img: "/images/category-office.svg" },
  { name: "Storage", img: "/images/category-storage.svg" },
];

export function CategoriesSection() {
  return (
    <section id="categories" className="py-12 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-2xl font-semibold text-slate-900">Featured Categories</h2>
        <p className="mt-2 text-sm text-slate-600">Shop by room and find pieces that fit your style.</p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((c) => (
            <div key={c.name} className="rounded overflow-hidden bg-white shadow-sm">
              <div className="relative h-40 w-full">
                <Image src={c.img} alt={c.name} fill className="object-cover" />
              </div>
              <div className="p-3 text-center font-medium">{c.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
