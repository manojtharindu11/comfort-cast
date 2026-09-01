package org.manojtharindu11.comfortcastbackend.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.manojtharindu11.comfortcastbackend.dto.CityDto;

import java.util.List;

public record CityListWrapper(@JsonProperty("List") List<City> cities) {
    public record City(
            @JsonProperty("CityCode") String cityCode,
            @JsonProperty("CityName") String cityName) {
    }
}
