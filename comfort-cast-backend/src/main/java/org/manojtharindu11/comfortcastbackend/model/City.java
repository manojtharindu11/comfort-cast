package org.manojtharindu11.comfortcastbackend.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

@Getter
public class City {

    @JsonProperty("CityCode")
    private String cityCode;

    @JsonProperty("CityName")
    private String cityName;
}
