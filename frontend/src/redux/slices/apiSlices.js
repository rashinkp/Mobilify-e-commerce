// productApiSlice.js or your main apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { useNavigate } from "react-router-dom";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000",
    credentials: "include", 
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Users", "Products"], 



  endpoints: (builder) => ({
    
  }),
  baseQuery: async (args, api, extraOptions) => {
    const baseQuery = fetchBaseQuery({
      baseUrl: "http://localhost:4000",
      credentials: "include",
      prepareHeaders: (headers) => {
        headers.set("Accept", "application/json");
        return headers;
      },
    });

    const result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
      const navigate = useNavigate();
      navigate("/admin/login"); 
    }

    return result;
  },
});

export default apiSlice;
