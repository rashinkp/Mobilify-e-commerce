import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    count: 0, 
  },
  reducers: {
    setCartCount: (state, action) => {
      state.count = action.payload; 
    },
    incrementCartCount: (state, action) => {
      state.count += action.payload || 1; 
    },
    decrementCartCount: (state, action) => {
      state.count -= action.payload || 1; 
    },
  },
});

export const { setCartCount, incrementCartCount, decrementCartCount } = cartSlice.actions;
export default cartSlice.reducer;
