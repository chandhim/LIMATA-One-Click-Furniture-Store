"use client";

import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-12 bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <h2 className="text-2xl font-semibold">Ready to Find Your Perfect Furniture?</h2>
        <p className="mt-2 text-sm text-slate-300">Browse our curated collection and bring your ideas to life.</p>
        <div className="mt-6">
          <Link href="/products" className="rounded-full bg-amber-500 px-6 py-3 font-medium text-slate-900">
            Start Shopping
          </Link>
        </div>
      </div>
    </section>
  );
}
