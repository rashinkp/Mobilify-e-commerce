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
    }),
    getACoupon: builder.query({
      query: ({ id }) => ({
        url: `${ADMIN_URL}/coupon/${id}`,
        method: 'GET',
      }),
      providesTags:['Coupon'],
    })
  }),
});

export const {useEditCouponMutation, useAddCouponMutation, useGetAllCouponQuery , useGetACouponQuery } = couponApiSlice;
