package org.manojtharindu11.comfortcastbackend.dto;

import org.manojtharindu11.comfortcastbackend.model.WeatherResponse;

import java.util.List;

public record WeatherResponseDto(
        long id,
        long visibility,
        String name,
        WeatherResponse.Main main,
        WeatherResponse.Wind wind,
        WeatherResponse.Clouds clouds,
        List<WeatherResponse.WeatherItem> weather
) {
}
