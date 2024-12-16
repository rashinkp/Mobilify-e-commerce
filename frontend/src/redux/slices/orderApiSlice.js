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
  }),
});

export const {usePlaceOrderMutation} = orderApiSlice;