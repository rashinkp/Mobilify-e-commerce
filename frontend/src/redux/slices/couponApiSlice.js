import { apiSlice } from "./apiSlices";

const ADMIN_URL = "/api/admin";
const USER_URL = "/api/user";

export const couponApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addCoupon: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/coupon`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Coupons", "Coupon", "All Coupons"],
    }),
    getAllCoupon: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/coupon`,
        method: "GET",
      }),
      providesTags: ["All Coupons"],
    }),
    editCoupon: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/coupon`,
        method: 'PUT',
        body:data,
      }),
     invalidatesTags: ['All Coupons'], 
    })
  }),
});

export const {useEditCouponMutation, useAddCouponMutation, useGetAllCouponQuery } = couponApiSlice;
