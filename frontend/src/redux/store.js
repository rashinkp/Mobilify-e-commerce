import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./slices/themeSlice.js";
import { thunk } from "redux-thunk";
import adminAuthReducer from '../redux/slices/AdminAuthSlice.js';
import userAuthReducer from '../redux/slices/UserAuthSlice.js';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    adminAuth: adminAuthReducer,
    userAuth:userAuthReducer
  },

  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});
