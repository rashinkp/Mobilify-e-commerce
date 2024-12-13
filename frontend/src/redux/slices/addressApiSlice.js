
import { apiSlice } from './apiSlices'


const USERS_URL = '/api/user';

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addAddress: builder.mutation({
      query: ({ userId, data }) => ({
        url: `${USERS_URL}/address/${userId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Address"],
    }),
    getAddress: builder.query({
      query: (userId) => ({
        url: `${USERS_URL}/address/${userId}`,
        method: "GET",
      }),
      providesTags: ["Address"],
    }),
    deleteAddress: builder.mutation({
      query: ( addressId ) => ({
        url: `${USERS_URL}/address/${addressId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Address"],
    }),
  }),
});


export const { useAddAddressMutation , useGetAddressQuery,  useDeleteAddressMutation } = usersApiSlice;