"use client";

import { useAuthBootstrap, useAuthGuard } from "@/features/auth/hooks/use-auth-session";
import { MainLayout } from "@/components/layout/main-layout";
import { ProductForm } from "@/features/admin-products/components/product-form";
import type { AuthRole } from "@/features/auth/types/auth.types";

export default function CreateProductPage() {
  useAuthBootstrap();
  const { isHydrated } = useAuthGuard("ADMIN" as AuthRole);

  if (!isHydrated) {
    return null;
  }

  return (
    <MainLayout>
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-slate-950">Create Product</h1>
          <p className="mt-2 text-slate-600">Add a new product to your catalog</p>
        </div>

        <ProductForm />
      </section>
    </MainLayout>
  );
}
