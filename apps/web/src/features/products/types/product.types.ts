export interface ProductSummary {
  id: string;
  name: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
}

export interface Product extends ProductSummary {
  description: string;
  material?: string;
  createdAt?: string;
  updatedAt?: string;
}
