import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./slices/themeSlice.js";
import { apiSlice } from "./slices/apiSlices.js";
import authAdminReducer from './slices/authAdmin.js'

const store = configureStore({
  reducer: {
    theme: themeReducer,
    adminAuth: authAdminReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});


export default store;
