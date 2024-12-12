// apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { adminLogout } from "./authAdmin.js"; // Import your logout action

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:4000",
  credentials: "include",
  prepareHeaders: (headers) => {
    headers.set("Accept", "application/json");
    return headers;
  },
});

const baseQueryWithInterceptor = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
   
    api.dispatch(adminLogout());

  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithInterceptor,
  tagTypes: ["Users", "Products"],
  endpoints: (builder) => ({
    // Your endpoints here
  }),
});

export default apiSlice;
