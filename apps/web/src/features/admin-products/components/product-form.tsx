"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateProduct } from "../hooks/use-create-product";
import { useUpdateProduct } from "../hooks/use-update-product";
import { useAdminProduct } from "../hooks/use-admin-products";
import { uploadImages, uploadModel } from "../services/admin-product.service";
import { ImageUpload } from "./image-upload";
import { ModelUpload } from "./model-upload";
import { useRouter } from "next/navigation";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  stock: z.number().int().min(0, "Stock must be non-negative"),
  category: z.string().min(1, "Category is required"),
  material: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  productId?: string;
  onSuccess?: () => void;
}

export function ProductForm({ productId, onSuccess }: ProductFormProps) {
  const router = useRouter();
  const { data: product, isLoading: isLoadingProduct } = useAdminProduct(productId || "");
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct(productId || "");

  const [images, setImages] = useState<File[]>([]);
  const [model, setModel] = useState<File | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category,
        material: product.material,
      });
    }
  }, [product, reset]);

  async function onSubmit(data: ProductFormData) {
    try {
      setUploadingFiles(true);

      let imageUrls: string[] = [];
      let modelUrl: string | undefined;

      if (images.length > 0) {
        const uploadRes = await uploadImages(images);
        imageUrls = uploadRes.urls;
      } else if (product?.images) {
        imageUrls = product.images;
      }

      if (model) {
        const uploadRes = await uploadModel(model);
        modelUrl = uploadRes.url;
      } else if (product?.model3dUrl) {
        modelUrl = product.model3dUrl;
      }

      const productData = {
        ...data,
        images: imageUrls,
        model3dUrl: modelUrl,
      };

      if (productId) {
        await updateProduct.mutateAsync(productData);
      } else {
        await createProduct.mutateAsync(productData);
      }

      router.push("/admin/products");
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setUploadingFiles(false);
    }
  }

  if (productId && isLoadingProduct) {
    return <div>Loading product...</div>;
  }

  const isLoading = isSubmitting || uploadingFiles;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-lg border border-slate-200 bg-white p-6">
      <div>
        <label className="block text-sm font-medium text-slate-950 mb-2">Product Name</label>
        <input
          {...register("name")}
          type="text"
          className="w-full rounded border border-slate-300 px-3 py-2 text-slate-950"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-950 mb-2">Description</label>
        <textarea
          {...register("description")}
          className="w-full rounded border border-slate-300 px-3 py-2 text-slate-950"
          rows={4}
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-950 mb-2">Price</label>
          <input
            {...register("price", { valueAsNumber: true })}
            type="number"
            step="0.01"
            className="w-full rounded border border-slate-300 px-3 py-2 text-slate-950"
          />
          {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-950 mb-2">Stock</label>
          <input
            {...register("stock", { valueAsNumber: true })}
            type="number"
            className="w-full rounded border border-slate-300 px-3 py-2 text-slate-950"
          />
          {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-950 mb-2">Category</label>
          <input
            {...register("category")}
            type="text"
            className="w-full rounded border border-slate-300 px-3 py-2 text-slate-950"
          />
          {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-950 mb-2">Material</label>
          <input {...register("material")} type="text" className="w-full rounded border border-slate-300 px-3 py-2 text-slate-950" />
        </div>
      </div>

      <ImageUpload onChange={setImages} initialImages={product?.images} />
      <ModelUpload onChange={setModel} initialUrl={product?.model3dUrl} />

      <div className="flex gap-3">
        <button type="submit" disabled={isLoading} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50">
          {isLoading ? "Saving..." : productId ? "Update Product" : "Create Product"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded border border-slate-300 px-4 py-2 text-slate-950 hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
