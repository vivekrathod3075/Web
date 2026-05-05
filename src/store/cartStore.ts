import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  size: string;
  qty: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: number, size: string) => void;
  updateQty: (productId: number, size: string, qty: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existing = get().items.find(
          (i) => i.productId === item.productId && i.size === item.size,
        );
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.productId === item.productId && i.size === item.size
                ? { ...i, qty: i.qty + item.qty }
                : i,
            ),
          });
        } else {
          set({ items: [...get().items, item] });
        }
      },
      removeItem: (productId, size) => {
        set({
          items: get().items.filter(
            (i) => !(i.productId === productId && i.size === size),
          ),
        });
      },
      updateQty: (productId, size, qty) => {
        if (qty <= 0) {
          get().removeItem(productId, size);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.productId === productId && i.size === size ? { ...i, qty } : i,
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      getTotal: () =>
        get().items.reduce((sum, item) => sum + item.price * item.qty, 0),
      getCount: () => get().items.reduce((sum, item) => sum + item.qty, 0),
    }),
    { name: "ep-cart" },
  ),
);
