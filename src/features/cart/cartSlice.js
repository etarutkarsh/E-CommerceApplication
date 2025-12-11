import { createSlice } from "@reduxjs/toolkit";

const GUEST_CART_KEY = "guest_cart_v1";
const GUEST_WISHLIST_KEY = "guest_wishlist_v1";

// Load guest data
const loadGuest = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

// Save guest cart/wishlist
const saveGuest = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Initial state
const initialState = {
  items: loadGuest(GUEST_CART_KEY),
  guestKey: GUEST_CART_KEY,
};

// Slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const { productId, qty = 1 } = action.payload;
      const found = state.items.find((i) => i.productId === productId);

      if (found) found.qty += qty;
      else state.items.push({ productId, qty });

      saveGuest(GUEST_CART_KEY, state.items);
    },

    removeFromCart(state, action) {
      state.items = state.items.filter((i) => i.productId !== action.payload);
      saveGuest(GUEST_CART_KEY, state.items);
    },

    updateQty(state, action) {
      const { productId, qty } = action.payload;
      const found = state.items.find((i) => i.productId === productId);

      if (found) found.qty = qty;
      saveGuest(GUEST_CART_KEY, state.items);
    },

    clearCart(state) {
      state.items = [];
      saveGuest(GUEST_CART_KEY, state.items);
    },
  },

  // Fix: Add reducer for "loadedUserCart"
  extraReducers: (builder) => {
    builder.addCase("cart/loadedUserCart", (state, action) => {
      state.items = action.payload;
    });
  },
});

export const { addToCart, removeFromCart, updateQty, clearCart } =
  cartSlice.actions;

// Merging guest cart when user logs in
export const mergeGuestDataOnLogin = (user) => (dispatch, getState) => {
  const guestCart = loadGuest(GUEST_CART_KEY) || [];

  try {
    if (user?.uid) {
      const userCartKey = `cart_${user.uid}`;

      const existingUserCart =
        JSON.parse(localStorage.getItem(userCartKey)) || [];

      const mergedCart = [...existingUserCart];

      // Merge guest cart
      guestCart.forEach((g) => {
        const idx = mergedCart.findIndex((x) => x.productId === g.productId);

        if (idx >= 0) mergedCart[idx].qty += g.qty;
        else mergedCart.push(g);
      });

      // Save merged data under user's cart
      localStorage.setItem(userCartKey, JSON.stringify(mergedCart));

      // Remove old guest cart
      localStorage.removeItem(GUEST_CART_KEY);

      // Dispatch merged data
      dispatch({ type: "cart/loadedUserCart", payload: mergedCart });
    }
  } catch (e) {
    console.error(e);
  }
};

export default cartSlice.reducer;
