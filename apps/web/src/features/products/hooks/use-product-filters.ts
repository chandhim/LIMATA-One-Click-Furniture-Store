"use client";

import { useReducer, useEffect, useState } from "react";
import type { ProductFilters, SortOption } from "../types/product.types";

const DEBOUNCE_MS = 400;
const LIMIT = 12;

const DEFAULT_FILTERS: ProductFilters = {
  search:   "",
  category: "",
  material: "",
  minPrice: "",
  maxPrice: "",
  inStock:  false,
  sort:     "newest",
  page:     1,
};

type Action =
  | { type: "SET_SEARCH";   payload: string }
  | { type: "SET_CATEGORY"; payload: string }
  | { type: "SET_MATERIAL"; payload: string }
  | { type: "SET_MIN_PRICE"; payload: string }
  | { type: "SET_MAX_PRICE"; payload: string }
  | { type: "TOGGLE_IN_STOCK" }
  | { type: "SET_SORT";     payload: SortOption }
  | { type: "SET_PAGE";     payload: number }
  | { type: "CLEAR_ALL" };

function reducer(state: ProductFilters, action: Action): ProductFilters {
  switch (action.type) {
    case "SET_SEARCH":    return { ...state, search:   action.payload, page: 1 };
    case "SET_CATEGORY":  return { ...state, category: action.payload, page: 1 };
    case "SET_MATERIAL":  return { ...state, material: action.payload, page: 1 };
    case "SET_MIN_PRICE": return { ...state, minPrice: action.payload, page: 1 };
    case "SET_MAX_PRICE": return { ...state, maxPrice: action.payload, page: 1 };
    case "TOGGLE_IN_STOCK": return { ...state, inStock: !state.inStock, page: 1 };
    case "SET_SORT":      return { ...state, sort:     action.payload, page: 1 };
    case "SET_PAGE":      return { ...state, page:     action.payload };
    case "CLEAR_ALL":     return { ...DEFAULT_FILTERS };
    default:              return state;
  }
}

export function useProductFilters() {
  const [filters, dispatch] = useReducer(reducer, DEFAULT_FILTERS);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input only
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(filters.search), DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [filters.search]);

  // Compute active filters (everything except page)
  const activeFilters: string[] = [];
  if (filters.category) activeFilters.push(`category:${filters.category}`);
  if (filters.material) activeFilters.push(`material:${filters.material}`);
  if (filters.minPrice) activeFilters.push(`minPrice:${filters.minPrice}`);
  if (filters.maxPrice) activeFilters.push(`maxPrice:${filters.maxPrice}`);
  if (filters.inStock)  activeFilters.push("inStock");
  if (filters.sort !== "newest") activeFilters.push(`sort:${filters.sort}`);

  // The query filters sent to React Query (uses debounced search)
  const queryFilters: Partial<ProductFilters> = {
    ...filters,
    search: debouncedSearch,
  };

  return {
    filters,
    queryFilters,
    debouncedSearch,
    activeFilterCount:  activeFilters.length,
    hasActiveFilters:   activeFilters.length > 0 || debouncedSearch.length > 0,
    limit: LIMIT,

    setSearch:    (v: string)     => dispatch({ type: "SET_SEARCH",    payload: v }),
    setCategory:  (v: string)     => dispatch({ type: "SET_CATEGORY",  payload: v }),
    setMaterial:  (v: string)     => dispatch({ type: "SET_MATERIAL",  payload: v }),
    setMinPrice:  (v: string)     => dispatch({ type: "SET_MIN_PRICE", payload: v }),
    setMaxPrice:  (v: string)     => dispatch({ type: "SET_MAX_PRICE", payload: v }),
    toggleInStock: ()             => dispatch({ type: "TOGGLE_IN_STOCK" }),
    setSort:      (v: SortOption) => dispatch({ type: "SET_SORT",      payload: v }),
    setPage:      (v: number)     => dispatch({ type: "SET_PAGE",      payload: v }),
    clearAll:     ()              => dispatch({ type: "CLEAR_ALL" }),
  };
}
