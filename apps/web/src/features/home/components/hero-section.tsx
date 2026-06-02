"use client";

import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:flex lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">Welcome to LIMATA</p>
          <h1 className="mt-4 text-4xl font-bold text-slate-900 sm:text-5xl">
            Transform Your Space with Smart Furniture Shopping
          </h1>
          <p className="mt-6 text-lg text-slate-600">
            Browse quality furniture, visualize products in your own environment, and make confident purchasing decisions with LIMATA.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/products" className="rounded-full bg-slate-900 px-6 py-3 text-white">
              Browse Products
            </Link>
            <a href="#about" className="rounded-full border border-slate-300 px-6 py-3 text-slate-900">
              Explore Features
            </a>
          </div>
        </div>

        <div className="mt-8 lg:mt-0 lg:ml-8 lg:w-1/2">
          <div className="relative w-full h-80 sm:h-96 rounded-lg overflow-hidden bg-gray-100">
            <Image src="/images/hero.svg" alt="Furniture" fill className="object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
