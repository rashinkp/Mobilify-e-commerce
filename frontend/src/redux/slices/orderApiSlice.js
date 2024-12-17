import { apiSlice } from "./apiSlices";

const ADMIN_URL = "/api/admin";
const USER_URL = '/api/user';

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    placeOrder: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/order`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Order"],
    }),
    getOrder: builder.query({
      query: ({ orderId }) => ({
        url: `${USER_URL}/order/${orderId}`,
        method: "GET",
      }),
      providesTags: ["Order"],
    }),
    getIndividualOrder: builder.query({
      query: () => ({
        url: `${USER_URL}/order`,
        method: "GET",
      }),
      providesTags: ["Orders"],
    }),
    getSingleOrder: builder.query({
      query: ({ productId , orderId }) => ({
        url: `${USER_URL}/order/${orderId}/${productId}`,
        method: "GET",
      }),
      providesTags: ["Orders"],
    }),
  }),
});

export const {usePlaceOrderMutation , useGetOrderQuery , useGetIndividualOrderQuery , useGetSingleOrderQuery} = orderApiSlice;