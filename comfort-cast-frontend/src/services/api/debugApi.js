import { api } from "../api";

export const debugApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getRawCacheStatus: builder.query({
      query: (cityCode) => `/weather/debug/cache/raw/${cityCode}`,
    }),
    getSummaryCacheStatus: builder.query({
      query: () => "/weather/debug/cache/summary",
    }),
  }),
});

export const { useGetRawCacheStatusQuery, useGetSummaryCacheStatusQuery } =
  debugApi;
