import { data } from "react-router";
import { apiSlice } from "./apiSlices";

const USERS_URL = "/api/user";
const ADMIN_URL = '/api/admin';

export const salesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSalesReport: builder.query({
      query: ({ startingDate, endingDate }) => ({
        url: `${ADMIN_URL}/sales?startingDate=${startingDate}&endingDate=${endingDate}`,
        method: "GET",
      }),
      providesTags: ["Sales"],
    }),
    getSalesForDashboard: builder.query({
      query: ({timeFilter,}) => ({
        url: `${ADMIN_URL}/salesDashboard?period=${timeFilter}`,
        method: "GET",
      }),
      providesTags: ["SalesDataForAdmin"],
    }),
    getSalesDetails: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/salesDetails`,
        method: 'GET',
        
      })

    })
  }),
});

export const {
  useGetSalesReportQuery,
  useGetSalesForDashboardQuery,
  useGetSalesDetailsQuery,
} = salesApiSlice;
