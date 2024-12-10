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
      providesTags: ["ProductDetail"],
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${ADMIN_URL}/product/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
    updateProduct: builder.mutation({
      query: ({ productId, data }) => ({
        url: `${ADMIN_URL}/product/${productId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["ProductDetail"],
    }),
    updateProductImage: builder.mutation({
      query: ({ productId, uploadedUrl, deleteQueue }) => ({
        url: `${ADMIN_URL}/product-images/${productId}`,
        method: "PUT",
        body: {
          uploadedUrl,
          deleteQueue, 
        },
      }),
      invalidatesTags: ["ProductDetail"],
    }),
  }),
});


export const { useAddProductMutation, useGetAllProductsQuery , useGetProductQuery , useDeleteProductMutation, useUpdateProductMutation,useUpdateProductImageMutation } = productApiSlice;