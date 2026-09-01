import { api } from "../api";

export const weatherApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getWeatherSummary: builder.query({
      query: () => "/weather/summary",
      providesTags: ["Weather"],
    }),
    getCityWeather: builder.query({
      query: (cityCode) => `/weather/${cityCode}`,
      providesTags: (result, error, cityCode) => [
        { type: "WeatherCity", id: cityCode },
      ],
    }),
  }),
});

export const { useGetWeatherSummaryQuery, useGetCityWeatherQuery } = weatherApi;
