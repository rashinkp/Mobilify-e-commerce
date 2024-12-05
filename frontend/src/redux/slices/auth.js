// src/features/data/dataSlice.js
import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "data",
  initialState: {
    user: null,
    loading: false,
    error: null,
    success:false,
  },
  reducers: {
    adminLoginStart(state) {
      state.loading = true;
      state.error = null;
    },
    adminLoginSuccess(state, action) {
      state.loading = false;
      state.data = action.payload;
      state.success = true;
    },
    adminLoginFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { adminLoginFailure,adminLoginStart,adminLoginSuccess } =
  adminSlice.actions;

export default adminSlice.reducer;
