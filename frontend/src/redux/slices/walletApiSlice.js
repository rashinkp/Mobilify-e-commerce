import { apiSlice } from "./apiSlices";

const ADMIN_URL = "/api/admin";
const USER_URL = "/api/user";

export const walletApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWallet: builder.query({
      query: () => ({
        url: `${USER_URL}/wallet`,
        method: "GET",
      }),
      providesTags: ["Wallet"],
    }),
    addAmount: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/wallet`,
        method: 'POST',
        body:data,
      }),
      invalidatesTags: ['Wallet'],
    })
  }),
});

export const {
  useGetWalletQuery,
  useAddAmountMutation
} = walletApiSlice;
