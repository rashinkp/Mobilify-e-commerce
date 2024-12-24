import { data } from "react-router";
import { apiSlice } from "./apiSlices";

const USERS_URL = "/api/user";
const ADMIn_URL = '/api/admin';

export const salesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSalesReport: builder.query({
      query: ({ startingDate, endingDate }) => ({
        url: `${ADMIn_URL}/sales?startingDate=${startingDate}&endingDate=${endingDate}`,
        method: "GET",
      }),
      providesTags: ["Sales"],
    }),
  }),
});

export const {
  useGetSalesReportQuery
} = salesApiSlice;
