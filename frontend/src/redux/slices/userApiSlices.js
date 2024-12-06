import { apiSlice } from './apiSlices'


const USERS_URL = '/api/user';

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url:`${USERS_URL}/login`,
        method: 'POST',
        body: data
      }),
      transformErrorResponse: (response) => response.data,
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/register`,
        method: 'POST',
        body:data,
      })
    })
  })
})


export const { useLoginMutation, useRegisterMutation } = usersApiSlice;