import { createSlice } from "@reduxjs/toolkit";

const GUEST_CART_KEY = "guest_cart_v1";

const loadGuest = () => {
  try {
    return JSON.parse(localStorage.getItem(GUEST_CART_KEY)) || [];
  } catch {
    return [];
  }
};

const saveGuest = (value) => {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(value));
};

// Store if merge has already happened once
const MERGE_FLAG_KEY = "cart_merge_done";

const initialState = {
  items: loadGuest(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const { productId, qty = 1 } = action.payload;
      const found = state.items.find((i) => i.productId === productId);

      if (found) found.qty += qty;
      else state.items.push({ productId, qty });

      saveGuest(state.items);
    },

    removeFromCart(state, action) {
      state.items = state.items.filter((i) => i.productId !== action.payload);
      saveGuest(state.items);
    },

    updateQty(state, action) {
      const { productId, qty } = action.payload;
      const found = state.items.find((i) => i.productId === productId);
      if (found) found.qty = qty;

      saveGuest(state.items);
    },

    clearCart(state) {
      state.items = [];
      saveGuest([]);
    },

    loadedUserCart(state, action) {
      state.items = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQty,
  clearCart,
  loadedUserCart,
} = cartSlice.actions;

// -------------------------------
// 🔥 FIXED MERGE FUNCTION
// -------------------------------
export const mergeGuestDataOnLogin = (user) => (dispatch, getState) => {
  if (!user?.uid) return;

  const MERGE_KEY = `cart_merge_${user.uid}`;

  // Prevent multiple merges after refresh
  if (localStorage.getItem(MERGE_KEY) === "done") return;

  const guestCart = loadGuest();
  const userCartKey = `cart_${user.uid}`;

  const existingUserCart = JSON.parse(localStorage.getItem(userCartKey)) || [];

  const mergedCart = [...existingUserCart];

  // Merge guest cart once
  guestCart.forEach((g) => {
    const idx = mergedCart.findIndex((x) => x.productId === g.productId);
    if (idx >= 0) mergedCart[idx].qty += g.qty;
    else mergedCart.push(g);
  });

  localStorage.setItem(userCartKey, JSON.stringify(mergedCart));
  localStorage.removeItem(GUEST_CART_KEY);

  // Mark merge as done so it NEVER runs again
  localStorage.setItem(MERGE_KEY, "done");

  dispatch(loadedUserCart(mergedCart));
};

export default cartSlice.reducer;
