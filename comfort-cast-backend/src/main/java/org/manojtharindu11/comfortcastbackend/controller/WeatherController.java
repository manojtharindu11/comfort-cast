package org.manojtharindu11.comfortcastbackend.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.manojtharindu11.comfortcastbackend.constant.CacheConstants;
import org.manojtharindu11.comfortcastbackend.dto.ApiResponseDto;
import org.manojtharindu11.comfortcastbackend.dto.CacheDebugDto;
import org.manojtharindu11.comfortcastbackend.dto.CityDto;
import org.manojtharindu11.comfortcastbackend.dto.CityWeatherDto;
import org.manojtharindu11.comfortcastbackend.exception.CityNotFoundException;
import org.manojtharindu11.comfortcastbackend.exception.WeatherDataUnavailableException;
import org.manojtharindu11.comfortcastbackend.service.CacheDebugService;
import org.manojtharindu11.comfortcastbackend.service.CityService;
import org.manojtharindu11.comfortcastbackend.service.WeatherAnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/weather")
@RequiredArgsConstructor
@Slf4j
public class WeatherController {

    private final WeatherAnalyticsService analyticsService;
    private final CityService cityService;
    private final CacheDebugService cacheDebugService;

    @GetMapping("/summary")
    public ResponseEntity<ApiResponseDto<List<CityWeatherDto>>> getWeatherSummary() {
        List<CityWeatherDto> response = analyticsService.getRankedWeather();

        return ResponseEntity.ok(new ApiResponseDto<>("Successfully generate ranked weather", response));
    }

    @GetMapping("/{cityCode}")
    public ResponseEntity<ApiResponseDto<CityWeatherDto>> getCityWeather(@PathVariable String cityCode) {
        CityDto cityDto = cityService.getCityByCode(cityCode);

        if (cityDto == null) {
            throw new CityNotFoundException(cityCode);
        }

        List<CityWeatherDto> ranked = analyticsService.getRankedWeather();

        CityWeatherDto match = ranked.stream()
                .filter(dto -> dto.cityCode().equals(cityCode))
                .findFirst()
                .orElse(null);

        if (match == null) {
            throw new WeatherDataUnavailableException("Weather data unavailable for city: " + cityCode);
        }
        return ResponseEntity.ok(new ApiResponseDto<>
                ("Successfully get the city weather information", match));
    }

    @GetMapping("/debug/cache/raw/{cityCode}")
    public ResponseEntity<ApiResponseDto<CacheDebugDto>> getRawCacheStatus(@PathVariable String cityCode) {

        CacheDebugDto cacheStatus = cacheDebugService.getCacheStatus(CacheConstants.RAW_WEATHER, cityCode);

        return ResponseEntity.ok(
                new ApiResponseDto<>("Cache status retrieved successfully", cacheStatus)
        );
    }

    @GetMapping("/debug/cache/summary")
    public ResponseEntity<ApiResponseDto<CacheDebugDto>> getSummaryCacheStatus() {

        CacheDebugDto cacheStatus = cacheDebugService
                .getCacheStatus(CacheConstants.WEATHER_SUMMARY, CacheConstants.WEATHER_SUMMARY_KEY);

        return ResponseEntity.ok(
                new ApiResponseDto<>("Cache status retrieved successfully", cacheStatus)
        );
    }
}
