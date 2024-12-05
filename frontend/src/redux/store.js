import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./slices/themeSlice.js";
import authReducer from "./slices/auth.js";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
  },
});
