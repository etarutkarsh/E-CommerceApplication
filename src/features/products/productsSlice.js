import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  items: [],
  byId: {},
  status: "idle",
  error: null,
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const res = await axios.get("https://fakestoreapi.com/products");
    return res.data;
  }
);

export const fetchProductsById = createAsyncThunk(
  "products/fetchProductById",
  async (id) => {
    const res = await axios.get(`https://fakestoreapi.com/products/${id}`);
    return res.data;
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProductsFromStatic(state, action) {
      state.items = action.payload;
      action.payload.forEach((p) => (state.byId[p.id] = p));
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchProducts.pending, (s) => {
      s.status = "loading";
    })
      .addCase(fetchProducts.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.items = a.payload;
        a.payload.forEach((p) => (s.byId[p.id] = p));
      })
      .addCase(fetchProducts.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.error.message;
      })
      .addCase(fetchProductsById.fulfilled, (s, a) => {
        s.byId[a.payload.id] = a.payload;
      });
  },
});

export const { setProductsFromStatic } = productsSlice.actions;
export default productsSlice.reducer;
