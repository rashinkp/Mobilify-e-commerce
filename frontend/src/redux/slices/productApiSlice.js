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
      invalidatesTags: ["Products"],
    }),
    getAllProducts: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/product`,
        method: "get",
      }),
      providesTags: ["Products"],
    }),
    getProduct: builder.query({
      query: (productId) => ({
        url: `${ADMIN_URL}/product/${productId}`,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${ADMIN_URL}/product/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});


export const { useAddProductMutation, useGetAllProductsQuery , useGetProductQuery , useDeleteProductMutation } = productApiSlice;