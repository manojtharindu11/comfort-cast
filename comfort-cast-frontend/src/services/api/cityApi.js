import { api } from "../api";

export const cityApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCities: builder.query({
      query: () => "/cities",
    }),
  }),
});

export const { useGetCitiesQuery } = cityApi;
