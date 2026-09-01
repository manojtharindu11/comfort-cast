import { api } from "../api";

export const weatherApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getWeatherSummary: builder.query({
      query: () => "/weather/summary",
    }),
    getCityWeather: builder.query({
      query: (cityCode) => `/weather/${cityCode}`,
    }),
  }),
});

export const { useGetWeatherSummaryQuery, useGetCityWeatherQuery } = weatherApi;
