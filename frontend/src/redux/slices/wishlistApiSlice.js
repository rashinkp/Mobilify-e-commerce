import { apiSlice } from "./apiSlices";

const USER_URL = '/api/user';

export const wishlistApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    toggleWishList: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/wishlist`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Wishlist"],
    }),
    getAllWishList: builder.query({
      query: () => ({
        url: `${USER_URL}/wishlist`,
        method: "GET",
      }),
      providesTags: ["Wishlist"],
    }),
    removeFromWishlist: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/wishlist`,
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["Wishlist"],
    }),
    addAllToCart: builder.mutation({
      query: () => ({
        url: `${USER_URL}/wishlist`,
        method: "PUT",
      }),
      invalidatesTags: ["Wishlist"],
    }),
  }),
});

export const {useToggleWishListMutation, useRemoveFromWishlistMutation,  useGetAllWishListQuery, useAddAllToCartMutation} = wishlistApiSlice;