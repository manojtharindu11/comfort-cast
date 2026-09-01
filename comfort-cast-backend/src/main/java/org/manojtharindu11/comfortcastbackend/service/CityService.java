package org.manojtharindu11.comfortcastbackend.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.manojtharindu11.comfortcastbackend.dto.CityDto;
import org.manojtharindu11.comfortcastbackend.model.CityListWrapper;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class CityService {

    private final ObjectMapper objectMapper;
    private List<CityListWrapper.City> cities = new ArrayList<>();

    @PostConstruct
    public void init() {
        loadCities();
    }

    public List<CityDto> getAllCities() {
        return cities.stream()
                .map(this::toDto)
                .toList();
    }

    public CityDto getCityByCode(String cityCode) {
        return cities.stream()
                .filter(city -> city.cityCode().equals(cityCode))
                .findFirst()
                .map(this::toDto)
                .orElse(null);
    }

    private CityDto toDto(CityListWrapper.City city) {
        return new CityDto(city.cityCode(), city.cityName());
    }

    private void loadCities() {
        try {
            InputStream inputStream = getClass().getResourceAsStream("/cities.json");

            if (inputStream == null) {
                log.error("cities.json file not found in the resources");
                return;
            }

            CityListWrapper wrapper = objectMapper.readValue(inputStream, CityListWrapper.class);
            cities = wrapper.cities();
            log.info("Successfully loaded {} cities from cities.json", cities.size());

        } catch (Exception e) {
            log.error("Error loading cities.json: {}", e.getMessage(), e);
        }
    }
}
