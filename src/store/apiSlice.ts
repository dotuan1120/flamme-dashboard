import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';
import { RootState } from './store';
import { apiUrl } from '../common/constants';

const baseQuery = fetchBaseQuery({
  baseUrl: `${apiUrl}`,
  prepareHeaders: (headers, { getState }) => {
    // By default, if we have a token in the store, let's use that for authenticated requests
    const token = (getState() as RootState).auth.token
    console.log('🚀 ~ token:', token)
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})

export const apiSlice = createApi({
  baseQuery,
  endpoints: () => ({}),
});
