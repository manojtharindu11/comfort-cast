package org.manojtharindu11.comfortcastbackend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.manojtharindu11.comfortcastbackend.constant.CacheConstants;
import org.manojtharindu11.comfortcastbackend.dto.CityDto;
import org.manojtharindu11.comfortcastbackend.dto.CityWeatherDto;
import org.manojtharindu11.comfortcastbackend.dto.WeatherResponseDto;
import org.manojtharindu11.comfortcastbackend.model.CityWeather;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class WeatherAnalyticsService {

    private final CityService cityService;
    private final WeatherService weatherService;
    private final ComfortIndexService comfortIndexService;

    @Cacheable(value = CacheConstants.WEATHER_SUMMARY, key = "'" + CacheConstants.WEATHER_SUMMARY_KEY + "'")
    public List<CityWeatherDto> getRankedWeather() {

        List<CityWeather> results = new ArrayList<>();

        for (CityDto city : cityService.getAllCities()) {

            try {
                WeatherResponseDto weather = weatherService.fetchWeather(city.cityCode());

                CityWeather cityWeather = buildCityWeather(city, weather);

                results.add(cityWeather);

            } catch (Exception e) {
                log.error("Failed to fetch weather for city {}", city.cityCode(), e);
            }
        }

        // Highest comfort index first
        results.sort(Comparator.comparingInt(CityWeather::getComfortIndex).reversed());

        // Assign rank
        for (int i = 0; i < results.size(); i++) {
            results.get(i).setRank(i + 1);
        }

        // Convert models to DTOs
        return results.stream().map(this::toDto).toList();
    }

    private CityWeather buildCityWeather(CityDto city, WeatherResponseDto weather) {

        double temperature = weather.main().temp();
        double humidity = weather.main().humidity();
        double windSpeed = weather.wind().speed();
        double pressure = weather.main().pressure();

        int comfortIndex = comfortIndexService.compute(temperature, humidity, windSpeed, pressure);

        String description = getDescription(weather);

        CityWeather cityWeather = new CityWeather();

        cityWeather.setCityCode(city.cityCode());
        cityWeather.setCityName(city.cityName());
        cityWeather.setDescription(description);
        cityWeather.setTempC(temperature);
        cityWeather.setHumidity(humidity);
        cityWeather.setWindMps(windSpeed);
        cityWeather.setComfortIndex(comfortIndex);
        cityWeather.setPressure(pressure);

        return cityWeather;
    }

    private String getDescription(WeatherResponseDto weather) {

        if (weather.weather() == null ||
                weather.weather().isEmpty()) {
            return "Unknown";
        }

        return weather.weather()
                .getFirst()
                .description();
    }

    private CityWeatherDto toDto(CityWeather weather) {

        return new CityWeatherDto(
                weather.getCityCode(),
                weather.getCityName(),
                weather.getDescription(),
                weather.getTempC(),
                weather.getHumidity(),
                weather.getWindMps(),
                weather.getPressure(),
                weather.getComfortIndex(),
                weather.getRank()
        );
    }
}