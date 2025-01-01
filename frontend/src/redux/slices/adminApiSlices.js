import { apiSlice } from "./apiSlices";

const ADMIN_URL = "/api/admin";

export const adminApiSLice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/login`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      transformErrorResponse: (response) => response.data,
    }),
    adminLogout: builder.mutation({
      query: () => ({
        url: `${ADMIN_URL}/logout`,
        method: "POST",
      }),
    }),
    fetchUsers: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/users`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    blockUser: builder.mutation({
      query: (userId) => ({
        url: `${ADMIN_URL}/user/${userId}`,
        method: "PUT",
      }),
      invalidatesTags: ["User"],
    }),
    addBrand: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/brand`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Brand"],
    }),

    getAllBrand: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/brand`,
        method: "GET",
      }),
      providesTags: ["Brand"],
    }),

    deleteBrand: builder.mutation({
      query: (brandId) => ({
        url: `${ADMIN_URL}/brand/${brandId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Brand"],
    }),
    getAdminData: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/profile`,
        method: "GET",
      }),
      providesTags: ["Admin"],
    }),
  }),
});

export const {
  useAdminLoginMutation,
  useAdminLogoutMutation,
  useFetchUsersQuery,
  useBlockUserMutation,
  useAddBrandMutation,
  useGetAllBrandQuery,
  useDeleteBrandMutation,
  useGetAdminDataQuery
} = adminApiSLice;
