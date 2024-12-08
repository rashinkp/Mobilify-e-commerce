import { apiSlice } from "./apiSlices";

const ADMIN_URL = "/api/admin";
const USER_URL = '/api/user';

export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addCategory: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/category`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),
    getAllCategory: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/category`,
        method: "GET",
      }),
      providesTags: ["Category"],
    }),
    editCategory: builder.mutation({
      query: ({categoryId, data}) => ({
        url: `${ADMIN_URL}/category/${categoryId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),
    deleteCategory: builder.mutation({
      query: (categoryId) => ({
        url: `${ADMIN_URL}/category/${categoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {useAddCategoryMutation, useGetAllCategoryQuery, useDeleteCategoryMutation , useEditCategoryMutation } = categoryApiSlice;