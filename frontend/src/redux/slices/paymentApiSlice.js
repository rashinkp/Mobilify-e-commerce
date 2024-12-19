import { apiSlice } from "./apiSlices";

const PAYMENTS_URL = "/api/user";

export const razorpayApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    savePayment: builder.mutation({
      query: (data) => ({
        url: `${PAYMENTS_URL}/savePayment`,
        method: "POST",
        body: data,
      }),
    }),
    verifyPayment: builder.mutation({
      query: (data) => ({
        url: `${PAYMENTS_URL}/verifyPayment`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const { useSavePaymentMutation , useVerifyPaymentMutation } = razorpayApiSlice;
