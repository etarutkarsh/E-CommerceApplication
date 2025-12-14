import { createSlice } from "@reduxjs/toolkit";
import { saveUserDetails, loginUser } from "./authThunks";

let saved = null;

try {
  const raw = localStorage.getItem("userDetails");
  saved = raw ? JSON.parse(raw) : null;
} catch (e) {
  saved = null;
}

const initialState = {
  user: saved ,
  loading: true,
};


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.loading = false;

      if (action.payload) {
        localStorage.setItem("userDetails", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("userDetails");
      }
    },

    logout(state) {
      state.user = null;
      state.loading = false;
      localStorage.removeItem("userDetails");
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(saveUserDetails.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        
        localStorage.setItem("userDetails", JSON.stringify(action.payload));
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
        state.loading = false;

        localStorage.setItem("userDetails", JSON.stringify(state.user));
      });
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
