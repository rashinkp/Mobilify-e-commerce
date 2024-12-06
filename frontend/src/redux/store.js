import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./slices/themeSlice.js";
import authReducer from "./slices/authSlice.js";
import { thunk } from "redux-thunk";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
  },

  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});
