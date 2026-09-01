package org.manojtharindu11.comfortcastbackend.controller;

import lombok.RequiredArgsConstructor;
import org.manojtharindu11.comfortcastbackend.dto.ApiResponseDto;
import org.manojtharindu11.comfortcastbackend.dto.CityDto;
import org.manojtharindu11.comfortcastbackend.service.CityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CityController {

    private final CityService cityService;

    @GetMapping("/cities")
    public ResponseEntity<ApiResponseDto<List<CityDto>>> getCities() {
        List<CityDto> cities = cityService.getAllCities();
        return ResponseEntity.ok(new ApiResponseDto<>("Successfully loaded cities", cities));
    }
}
