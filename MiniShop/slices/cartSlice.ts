import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "@/types/product";
import type { CartItem } from "@/types/cart";

type CartState = {
  items: CartItem[];
};

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    hydrateCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },

    addToCart: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const existing = state.items.find((i) => i.id === product.id);

      if (existing) {
        existing.quantity += 1;
        return;
      }

      state.items.push({
        ...product,
        quantity: 1,
      });
    },

    increaseQuantity: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (!item) return;
      item.quantity += 1;
    },

    decreaseQuantity: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (!item) return;

      item.quantity -= 1;

      if (item.quantity <= 0) {
        state.items = state.items.filter((i) => i.id !== id);
      }
    },

    removeItem: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      state.items = state.items.filter((i) => i.id !== id);
    },
  },
});

export const {
  hydrateCart,
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeItem,
} = cartSlice.actions;

export default cartSlice.reducer;
