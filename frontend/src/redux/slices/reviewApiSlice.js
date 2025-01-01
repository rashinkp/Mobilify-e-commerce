import apiSlice from "./apiSlices";

const USERS_URL = "/api/user";
const ADMIN_URL = "/api/admin";

export const reviewApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    postReview: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/review`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Review"],
    }),
    getAReview: builder.query({
      query: ({ productId }) => ({
        url: `${USERS_URL}/getAReview/${productId}`,
        method: "GET",
      }),
      providesTags: ["Review"],
    }),
    productReview: builder.query({
      query: ({ productId }) => ({
        url: `${USERS_URL}/productReview/${productId}`,
        method: "GET",
      }),
      providesTags: ["ProductReview"],
    }),
  }),
});

export const {
  usePostReviewMutation,
  useGetAReviewQuery,
  useProductReviewQuery,
} = reviewApiSlice;
