export interface ProductSummary {
  productId: string;
  name: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
}

export interface Product extends ProductSummary {
  description: string;
  material?: string;
  model3dUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}
