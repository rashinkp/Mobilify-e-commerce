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
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("Error adding product:", err);
        }
      },
    }),
    getAllProducts: builder.query({
      query: ({
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        order = "desc",
      } = {}) => ({
        url: `${ADMIN_URL}/product?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}`,
        method: "GET",
      }),
      providesTags: ["Products"],
    }),
    getProducts: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/product?all=true`,
        method: "GET",
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
      invalidatesTags: ["Products", "ProductDetail"],
    }),
    updateProduct: builder.mutation({
      query: ({ productId, data }) => ({
        url: `${ADMIN_URL}/product/${productId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Products", "ProductDetail"],
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
      invalidatesTags: ["Products", "ProductDetail"],
    }),
  }),
});


export const {
  useAddProductMutation,
  useGetAllProductsQuery,
  useGetProductQuery,
  useDeleteProductMutation,
  useUpdateProductMutation,
  useUpdateProductImageMutation,
  useGetProductsQuery
} = productApiSlice;