import { apiSlice } from "./apiSlices";

const ADMIN_URL = "/api/admin";
const USER_URL = "/api/user";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addProduct: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/product`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
    getAllProducts: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/product`,
        method: "get",
      }),
      providesTags: ["Product"],
    }),
  }),
});


export const { useAddProductMutation, useGetAllProductsQuery } = productApiSlice;