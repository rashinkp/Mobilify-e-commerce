import { apiSlice } from "./apiSlices";

const USER_URL = '/api/user';

export const wishlistApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    toggleWishList: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/wishlist`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Wishlist"],
    }),
    getAllWishList: builder.query({
      query: () => ({
        url: `${USER_URL}/wishlist`,
        method:'GET'
      }),
      providesTags:['Wishlist']
    })
  }),

});

export const {useToggleWishListMutation,  useGetAllWishListQuery} = wishlistApiSlice;