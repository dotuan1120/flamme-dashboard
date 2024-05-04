import RequestResponseType from 'src/types/api';
import { apiSlice } from './apiSlice';
const STATS_URL = '/stats';

export const statsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStatsByTeamId: builder.query({
      query: ({ teamId, year }) => ({ url: `${STATS_URL}?teamId=${teamId}&year=${year}` }),
      transformResponse: (response: RequestResponseType<any>) => {
        return response.data
      },
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
    useLazyGetStatsByTeamIdQuery,
  // useLogoutMutation,
  // useRegisterMutation,
  // useUpdateUserMutation,
} = statsApiSlice;
