package org.manojtharindu11.comfortcastbackend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.manojtharindu11.comfortcastbackend.model.City;

import java.util.List;

public record CityListWrapperDto(@JsonProperty("List") List<City> cities) {
}
