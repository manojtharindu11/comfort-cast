package org.manojtharindu11.comfortcastbackend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CityWeather {
    private String cityCode;
    private String cityName;
    private String description;
    private double tempC;
    private double humidity;
    private double windMps;
    private double pressure;
    private int comfortIndex;
    private int rank;
}
