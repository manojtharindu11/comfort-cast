package org.manojtharindu11.comfortcastbackend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record WeatherResponse(
        long id,
        long visibility,
        String name,
        Main main,
        Wind wind,
        Clouds clouds,
        List<WeatherItem> weather
) {

    public record Main(
            double temp,

            @JsonProperty("feels_like")
            double feelsLike,

            double humidity,
            double pressure
    ) {
    }

    public record Wind(
            double speed
    ) {
    }

    public record Clouds(
            int all
    ) {
    }

    public record WeatherItem(
            String main,
            String description
    ) {
    }
}