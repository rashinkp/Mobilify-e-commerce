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
    }),
    adminLogout: builder.mutation({
      query: () => ({
        url: `${ADMIN_URL}/logout`,
        method:"POST",
      })
    })





  })
})


export const {
  useAdminLoginMutation,
  useAdminLogoutMutation
} = adminApiSLice;