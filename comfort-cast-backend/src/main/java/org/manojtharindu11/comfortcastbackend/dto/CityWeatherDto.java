package org.manojtharindu11.comfortcastbackend.dto;

public record CityWeatherDto(
        String cityCode,
        String cityName,
        String description,
        double tempC,
        double humidity,
        double windMps,
        int comfortIndex,
        int rank
) {
}