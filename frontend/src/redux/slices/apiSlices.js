import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLogout } from "./authUser";
import { adminLogout } from "./authAdmin";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:4000",
  credentials: "include",
  prepareHeaders: (headers) => {
    headers.set("Accept", "application/json");
    return headers;
  },
});

const baseQueryWithInterceptor = async (args, api, extraOptions) => {
  try {
    const result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
      const isAdminPath = args.url.startsWith("/admin");
      if (isAdminPath) {
        api.dispatch(adminLogout());
      } else {
        api.dispatch(userLogout());
      }
    }

    return result;
  } catch (err) {
    return {
      error: {
        status: 500,
        data: { message: "An unexpected error occurred" },
      },
    };
  }
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithInterceptor,
  tagTypes: ["Users", "Products"],
  endpoints: (builder) => ({}),
});

export default apiSlice;
