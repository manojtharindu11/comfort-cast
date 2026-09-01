import { api } from "../api";

export const debugApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getRawCacheStatus: builder.query({
      query: (cityCode) => `/weather/debug/cache/raw/${cityCode}`,
      providesTags: ["Cache"],
    }),
    getSummaryCacheStatus: builder.query({
      query: () => "/weather/debug/cache/summary",
      providesTags: ["Cache"],
    }),
  }),
});

export const { useGetRawCacheStatusQuery, useGetSummaryCacheStatusQuery } =
  debugApi;
