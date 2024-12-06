import { createSlice } from "@reduxjs/toolkit";

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState: {
    user: localStorage.getItem("admin")
      ? JSON.parse(localStorage.getItem("admin"))
      : null,
    loading: false,
    error: null,
    success: false,
  },

  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.user = action.payload;
      state.success = true;
      state.error = null;
      localStorage.setItem("admin", JSON.stringify(action.payload));
    },
    loginFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});



export const { loginStart, loginSuccess, loginFailure } = adminAuthSlice.actions;

export default adminAuthSlice.reducer;