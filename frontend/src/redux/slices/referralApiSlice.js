import apiSlice from "./apiSlices";

const USERS_URL = "/api/user";
const ADMIN_URL = "/api/admin";

export const referralApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createReferralCode: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/referral`,
        method: "POST",
      }),
      invalidatesTags: ["Referral"],
    }),
    getUserReferrals: builder.query({
      query: () => ({
        url: `${USERS_URL}/referral`,
        method: "GET",
      }),
      providesTags: ["Referral"],
    }),
    getAllReferralData: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/referral`,
        method:'GET',
      }),
      providesTags: ['Admin Referral']
    }),
  }),
});

export const { useCreateReferralCodeMutation, useGetUserReferralsQuery , useGetAllReferralDataQuery } = referralApiSlice;
