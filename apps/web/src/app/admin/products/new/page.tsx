"use client";

import Link from "next/link";
import { ProductForm } from "@/features/admin-products/components/product-form";

export default function CreateProductPage() {
  return (
    <div style={{ padding: "2.5rem 2rem", maxWidth: 1200 }}>
      {/* Breadcrumb + header */}


      <ProductForm />
    </div>
  );
}
