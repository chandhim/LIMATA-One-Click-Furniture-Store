"use client";

import Link from "next/link";
import { useAuthBootstrap, useAuthGuard } from "@/features/auth/hooks/use-auth-session";
import { MainLayout } from "@/components/layout/main-layout";
import { ProductTable } from "@/features/admin-products/components/product-table";
import type { AuthRole } from "@/features/auth/types/auth.types";

export default function AdminProductsPage() {
  useAuthBootstrap();
  const { isHydrated } = useAuthGuard("ADMIN" as AuthRole);

  if (!isHydrated) {
    return null;
  }

  return (
    <MainLayout>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-950">Product Management</h1>
            <p className="mt-2 text-slate-600">Manage your product catalog</p>
          </div>
          <Link href="/admin/products/new" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            Add Product
          </Link>
        </div>

        <ProductTable />
      </section>
    </MainLayout>
  );
}
