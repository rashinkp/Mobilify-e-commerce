import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./slices/themeSlice.js";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
  },
});
