package org.manojtharindu11.comfortcastbackend.service;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.manojtharindu11.comfortcastbackend.dto.CityListWrapperDto;
import org.manojtharindu11.comfortcastbackend.model.City;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class CityService {

    private final ObjectMapper objectMapper;
    private List<City> cities = new ArrayList<>();

    public CityService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @PostConstruct
    public void init() {
        loadCities();
    }

    public void loadCities() {
        try {
            // Read the JSON file from the resources
            InputStream inputStream = getClass().getResourceAsStream("/cities.json");

            if (inputStream == null) {
                log.error("cities.json file not found in the resources");
                return;
            }

            CityListWrapperDto wrapper = objectMapper.readValue(inputStream, CityListWrapperDto.class);
            cities = wrapper.cities();

            log.info("Successfully loaded {} cities from cities.json", cities.size());
            cities.stream().limit(5).forEach(city ->
                    log.debug("Loaded city: {} (ID: {})", city.getCityName(), city.getCityCode())
            );

        } catch (Exception e) {
            log.error("Error loading cities.json: {}", e.getMessage(), e);
        }
    }

    public List<City> getAllCities() {
        return new ArrayList<>(cities);
    }

    public City getCityByCode(String cityCode) {
        return cities.stream()
                .filter(city -> city.getCityCode().equals(cityCode))
                .findFirst()
                .orElse(null);
    }

    public List<String> getAllCityCodes() {
        return cities.stream()
                .map(City::getCityCode)
                .collect(Collectors.toList());
    }

    public List<String> getAllCityNames() {
        return cities.stream()
                .map(City::getCityName)
                .collect(Collectors.toList());
    }
}
