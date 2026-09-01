package org.manojtharindu11.comfortcastbackend.dto;

public record CityWeatherDto(
        String cityCode,
        String cityName,
        String description,
        double tempC,
        double humidity,
        double windMps,
        double pressure,
        int comfortIndex,
        int rank
) {
}