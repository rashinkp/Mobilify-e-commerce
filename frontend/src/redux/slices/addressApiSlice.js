import { data } from "react-router";
import { apiSlice } from "./apiSlices";

const USERS_URL = "/api/user";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addAddress: builder.mutation({
      query: ({data }) => ({
        url: `${USERS_URL}/address`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Address"],
    }),
    getAddress: builder.query({
      query: (data) => ({
        url: `${USERS_URL}/address`,
        method: "GET",
      }),
      providesTags: ["Address"],
    }),
    deleteAddress: builder.mutation({
      query: (addressId) => ({
        url: `${USERS_URL}/address/${addressId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Address"],
    }),
    updateAddress: builder.mutation({
      query: ({addressId,data}) => ({
        url: `${USERS_URL}/address`,
        method: 'PUT',
        body:{data,addressId}
      }),
      invalidatesTags: ['Address'],
    }),
  }),
});

export const {
  useAddAddressMutation,
  useGetAddressQuery,
  useDeleteAddressMutation,
  useUpdateAddressMutation
} = usersApiSlice;
