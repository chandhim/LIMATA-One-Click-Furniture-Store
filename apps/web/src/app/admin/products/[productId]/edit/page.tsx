"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { ProductForm } from "@/features/admin-products/components/product-form";
import {
  useAuthBootstrap,
  useAuthGuard,
} from "@/features/auth/hooks/use-auth-session";
import type { AuthRole } from "@/features/auth/types/auth.types";
import { use } from "react";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  useAuthBootstrap();
  const { isHydrated } = useAuthGuard("ADMIN" as AuthRole);
  const { productId } = use(params);

  if (!isHydrated) {
    return null;
  }

  return (
    <MainLayout>
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-slate-950">
            Edit Product
          </h1>
          <p className="mt-2 text-slate-600">Update product details</p>
        </div>

        <ProductForm productId={productId} />
      </section>
    </MainLayout>
  );
}
