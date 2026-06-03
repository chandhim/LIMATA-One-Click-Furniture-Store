"use client";

import Link from "next/link";
import Image from "next/image";
import type { ProductSummary } from "../types/product.types";

export function ProductCard({ product }: { product: ProductSummary }) {
  const img = product.images?.[0] ?? "/favicon.ico";

  return (
    <Link
      href={`/products/${product.id}`}
      className="block border rounded-md p-3 hover:shadow-lg transition-shadow bg-white"
    >
      <div className="w-full h-48 relative mb-3 bg-gray-50 rounded overflow-hidden">
        <Image src={img} alt={product.name} fill className="object-cover rounded" />
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
        <div className="text-sm text-gray-600">{product.category}</div>
        <div className="mt-2 font-medium text-gray-800">Rs. {product.price.toLocaleString()}</div>
        <div className={`text-xs mt-1 ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
          {product.stock > 0 ? "In Stock" : "Out of stock"}
        </div>
      </div>
    </Link>
  );
}
