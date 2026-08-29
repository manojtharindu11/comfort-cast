package org.manojtharindu11.comfortcastbackend.controller;

import org.manojtharindu11.comfortcastbackend.model.City;
import org.manojtharindu11.comfortcastbackend.service.CityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class TestController {

    public TestController(CityService cityService) {
        this.cityService = cityService;
    }

    private final CityService cityService;

    @GetMapping("/cities")
    public ResponseEntity<Map<String, Object>> getCities() {
        Map<String, Object> response = new HashMap<>();
        List<City> cities = cityService.getAllCities();
        List<String> cityCodes = cityService.getAllCityCodes();

        response.put("totalCities", cities.size());
        response.put("cities", cities);
        response.put("cityCodes", cityCodes);
        response.put("message", "Successfully loaded cities.json");

        return ResponseEntity.ok(response);
    }
}
