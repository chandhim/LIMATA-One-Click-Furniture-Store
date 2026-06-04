"use client";

import Link from "next/link";
import { useAdminProducts } from "../hooks/use-admin-products";
import { useDeleteProduct } from "../hooks/use-delete-product";

export function ProductTable() {
  const { data: products, isLoading } = useAdminProducts();
  const deleteProduct = useDeleteProduct();

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  if (!products?.length) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
        <p className="text-slate-600">No products found</p>
        <Link href="/admin/products/new" className="mt-4 inline-block text-blue-600 hover:underline">
          Create your first product
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full">
        <thead className="border-b border-slate-200 bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-950">Image</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-950">Name</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-950">Category</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-950">Price</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-950">Stock</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-950">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {products.map((product: any) => (
            <tr key={product.id} className="hover:bg-slate-50">
              <td className="px-6 py-3">
                {product.images?.[0] && (
                  <img src={product.images[0]} alt={product.name} className="h-12 w-12 object-cover rounded" />
                )}
              </td>
              <td className="px-6 py-3 text-sm text-slate-950">{product.name}</td>
              <td className="px-6 py-3 text-sm text-slate-600">{product.category}</td>
              <td className="px-6 py-3 text-sm text-slate-950">${product.price}</td>
              <td className="px-6 py-3 text-sm text-slate-950">{product.stock}</td>
              <td className="px-6 py-3 text-sm">
                <Link href={`/admin/products/${product.id}/edit`} className="mr-4 text-blue-600 hover:underline">
                  Edit
                </Link>
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this product?")) {
                      deleteProduct.mutate(product.id);
                    }
                  }}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
