import { api } from "../api";

export const cityApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCities: builder.query({
      query: () => '/cities',
      providesTags: ['City'],
    }),
  }),
});

export const { useGetCitiesQuery} = cityApi;
