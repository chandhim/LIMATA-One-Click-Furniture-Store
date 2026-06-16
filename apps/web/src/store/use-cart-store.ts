import { create } from "zustand";

/**
 * Stores only the derived cart item count for use in the Navbar badge.
 * Cart DATA lives in React Query — this is UI-only state.
 */
type CartStore = {
  count: number;
  setCount: (count: number) => void;
  reset: () => void;
};

export const useCartStore = create<CartStore>((set) => ({
  count: 0,
  setCount: (count) => set({ count }),
  reset: () => set({ count: 0 }),
}));
