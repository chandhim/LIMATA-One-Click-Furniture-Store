"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useProduct } from "@/features/products/hooks/use-product";
import { useEffect } from "react";

export default function ProductDetails({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data, isLoading, isError } = useProduct(id);
  const router = useRouter();

  useEffect(() => {
    if (isError) {
      // no-op: could navigate back
    }
  }, [isError]);

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (isError || !data)
    return <div className="p-6">Product not found. <button onClick={() => router.push('/products')} className="ml-2 px-3 py-1 bg-gray-800 text-white rounded">Back</button></div>;

  const main = data.images?.[0] ?? "/favicon.ico";

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="w-full h-96 relative mb-4 bg-gray-50 rounded overflow-hidden">
            <Image src={main} alt={data.name} fill className="object-cover rounded" />
          </div>
          {/* thumbnails */}
          <div className="flex gap-2">
            {data.images.map((src) => (
              <div key={src} className="w-20 h-20 bg-gray-100 rounded overflow-hidden relative">
                <Image src={src} alt={data.name} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold">{data.name}</h1>
          <div className="text-xl mt-2 text-gray-800">Rs. {data.price.toLocaleString()}</div>
          <div className="mt-2 text-sm text-gray-600">Category: {data.category}</div>
          <div className="mt-2 text-sm text-gray-600">Material: {data.material ?? "-"}</div>
          <div className="mt-2 text-sm font-medium">Stock: {data.stock}</div>

          <div className="mt-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded">Add To Cart</button>
          </div>

          <div className="mt-6 text-gray-700">{data.description}</div>
        </div>
      </div>
    </div>
  );
}
