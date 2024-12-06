import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
    success:false
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
    },
    loginFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    }

  }
})



export const { loginStart, loginSuccess, loginFailure } = authSlice.actions;

export default authSlice.reducer;