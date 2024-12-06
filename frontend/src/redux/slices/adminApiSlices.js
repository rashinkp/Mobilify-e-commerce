import { apiSlice } from "./apiSlices";

const ADMIN_URL = '/api/admin';

export const adminApiSLice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/login`,
        method: 'POST',
        body: data,
        credentials:'include'
      }),
      transformErrorResponse:(response) => response.data,
    })





  })
})


export const {
  useAdminLoginMutation
} = adminApiSLice;