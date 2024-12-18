import { apiSlice } from "./apiSlices";

const ADMIN_URL = "/api/admin";
const USER_URL = '/api/user';

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    placeOrder: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/order`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Order"],
    }),
    getOrder: builder.query({
      query: ({ orderId }) => ({
        url: `${USER_URL}/order/${orderId}`,
        method: "GET",
      }),
      providesTags: ["Order"],
    }),
    getIndividualOrder: builder.query({
      query: () => ({
        url: `${USER_URL}/order`,
        method: "GET",
      }),
      providesTags: ["Orders"],
    }),
    getSingleOrder: builder.query({
      query: ({ orderId }) => ({
        url: `${USER_URL}/order/${orderId}`,
        method: "GET",
      }),
      providesTags: ["Orders"],
    }),
    getAllOrders: builder.query({
      query: ({page = 1 , limit =3}) => ({
        url: `${ADMIN_URL}/order?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["All Orders"],
    }),
    getAOrder: builder.query({
      query: ({ orderId }) => ({
        url: `${ADMIN_URL}/order/${orderId}`,
        method: "GET",
      }),
      providesTags: ["Order"],
    }),
    changeOrderStatus: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/order`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Orders",'Order','All Orders'],
    }),
  }),
});

export const {usePlaceOrderMutation , useGetOrderQuery , useGetIndividualOrderQuery , useGetSingleOrderQuery , useGetAllOrdersQuery , useGetAOrderQuery,  useChangeOrderStatusMutation} = orderApiSlice;