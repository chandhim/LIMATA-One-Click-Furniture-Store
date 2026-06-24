import { create } from "zustand";

/**
 * Stores only the derived wishlist item count for use in the Navbar badge.
 * Wishlist DATA lives in React Query — this is UI-only state.
 */
type WishlistStore = {
  count: number;
  setCount: (count: number) => void;
  reset: () => void;
};

export const useWishlistStore = create<WishlistStore>((set) => ({
  count: 0,
  setCount: (count) => set({ count }),
  reset: () => set({ count: 0 }),
}));
