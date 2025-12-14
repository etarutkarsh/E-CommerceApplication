import { createSlice } from "@reduxjs/toolkit";

const GUEST_WISHLIST_KEY = "guest_wishlist_v1";

const loadGuest = () => {
  try {
    const raw = localStorage.getItem(GUEST_WISHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveGuest = (value) => {
  localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(value));
};

const initialState = {
  items: loadGuest(), // Always loads at startup
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist(state, action) {
      const id = String(action.payload);

      if (!state.items.includes(id)) {
        state.items.push(id);
        saveGuest(state.items); // 💾 Update localStorage
      }
    },

    removeFromWishlist(state, action) {
      const id = Number(action.payload);

      state.items = state.items.filter((item) => item !== id);
      saveGuest(state.items); // 💾 Update localStorage
    },

    clearWishlist(state) {
      state.items = [];
      saveGuest([]); // 💾 Clear localStorage
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;
