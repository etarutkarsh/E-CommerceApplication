import { createSlice } from "@reduxjs/toolkit";
import { saveUserDetails, loginUser } from "./authThunks";

const saved = JSON.parse(localStorage.getItem("userDetails"));

const initialState = { user: saved || null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      localStorage.setItem("userDetails", JSON.stringify(action.payload));
    },

    logout(state) {
      state.user = null;
      localStorage.removeItem("userDetails");
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(saveUserDetails.fulfilled, (state, action) => {
        state.user = action.payload;
        localStorage.setItem("userDetails", JSON.stringify(action.payload));
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem("userDetails", JSON.stringify(state.user));
      });
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
