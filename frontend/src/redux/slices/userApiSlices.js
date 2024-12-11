import { apiSlice } from './apiSlices'


const USERS_URL = '/api/user';

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: "POST",
        body: data,
      }),
      transformErrorResponse: (response) => response.data,
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/register`,
        method: "POST",
        body: data,
      }),
    }),
    sendOtp: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/getotp`,
        method: "POST",
        body: data,
      }),
    }),
    resendotp: builder.mutation({
      query: (data) => {
        console.log(data);
        return {
          url: `${USERS_URL}/resendotp`,
          method: "POST",
          body: data,
        }
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
    googleSign: builder.mutation({
      query: (data) => {
        console.log(data)
        return({
        url: `${USERS_URL}/googlesign`,
        method: 'POST',
        body: data
      })
      }
    }),
  }),
});


export const { useLoginMutation, useRegisterMutation,useLogoutMutation, useSendOtpMutation,useResendotpMutation, useGoogleSignMutation } = usersApiSlice;