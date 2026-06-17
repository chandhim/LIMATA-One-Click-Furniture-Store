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
  model3dUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type SortOption = "newest" | "price_asc" | "price_desc" | "name_asc" | "name_desc";

export interface ProductFilters {
  search:   string;
  category: string;
  material: string;
  minPrice: string;
  maxPrice: string;
  inStock:  boolean;
  sort:     SortOption;
  page:     number;
}

export interface ProductListResponse {
  products: ProductSummary[];
  total:    number;
}
