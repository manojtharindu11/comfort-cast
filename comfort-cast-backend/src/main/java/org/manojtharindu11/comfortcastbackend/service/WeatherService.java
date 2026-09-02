package org.manojtharindu11.comfortcastbackend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.manojtharindu11.comfortcastbackend.constant.CacheConstants;
import org.manojtharindu11.comfortcastbackend.dto.WeatherResponseDto;
import org.manojtharindu11.comfortcastbackend.exception.ExternalServiceException;
import org.manojtharindu11.comfortcastbackend.model.WeatherResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Service
@Slf4j
@RequiredArgsConstructor
public class WeatherService {

    private final RestClient restClient;

    @Value("${openweathermap.api-key}")
    private String apiKey;

    @Cacheable(value = CacheConstants.RAW_WEATHER, key = "#cityCode")
    public WeatherResponseDto fetchWeather(String cityCode) {

        log.info("CACHE MISS -> fetching from OpenWeatherMap for city ID: {}", cityCode);
        try {
            WeatherResponse weatherResponse = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/data/2.5/weather")
                            .queryParam("id", cityCode)
                            .queryParam("appid", apiKey)
                            .queryParam("units", "metric")
                            .build()
                    )
                    .retrieve()
                    .body(WeatherResponse.class);

            return toDto(weatherResponse);
        } catch (RestClientException e) {
            throw new ExternalServiceException("Failed to fetch weather for city: " + cityCode, e);
        }

    }

    private WeatherResponseDto toDto(WeatherResponse weatherResponse) {
        return new WeatherResponseDto(
                weatherResponse.id(),
                weatherResponse.visibility(),
                weatherResponse.name(),
                weatherResponse.main(),
                weatherResponse.wind(),
                weatherResponse.clouds(),
                weatherResponse.weather()
        );
    }
}
