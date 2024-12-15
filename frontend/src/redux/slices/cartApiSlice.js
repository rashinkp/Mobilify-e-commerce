import { apiSlice } from "./apiSlices";

const ADMIN_URL = "/api/admin";
const USER_URL = "/api/user";

export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addToCart: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/cart`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['Cart'],
    }),
    getCart: builder.query({
      query: () => ({
        url: `${USER_URL}/cart`,
        method: 'GET',
      }),
      providesTags: ['Cart']
    })
  }),
});

export const {useAddToCartMutation , useGetCartQuery} = cartApiSlice;
