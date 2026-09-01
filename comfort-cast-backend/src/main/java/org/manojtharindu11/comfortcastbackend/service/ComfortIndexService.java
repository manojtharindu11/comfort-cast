package org.manojtharindu11.comfortcastbackend.service;

import org.springframework.stereotype.Service;

@Service
public class ComfortIndexService {

    private static final double TEMP_WEIGHT = 0.5;
    private static final double HUMIDITY_WEIGHT = 0.3;
    private static final double WIND_WEIGHT = 0.2;

    public int compute(double tempC, double humidity, double windMps) {
        double temperatureScore = temperatureScore(tempC);
        double humidityScore = humidityScore(humidity);
        double windScore = windScore(windMps);

        double total = TEMP_WEIGHT * temperatureScore + HUMIDITY_WEIGHT * humidityScore + WIND_WEIGHT * windScore;

        return (int) Math.floor(total + 0.5);
    }

    private double temperatureScore(double tempC) {
        double idealLow = 20.0;
        double idealHigh = 25.0;
        if (tempC >= idealLow && tempC <= idealHigh) {
            return 100.0;
        }
        if (tempC < idealLow) {
            return Math.max(0.0, 100.0 - (idealLow - tempC) * 6.0);
        }
        return Math.max(0.0, 100.0 - (tempC - idealHigh) * 10.0);
    }

    private double humidityScore(double humidity) {
        double idealLow = 30.0;
        double idealHigh = 60.0;
        if (humidity >= idealLow && humidity <= idealHigh) {
            return 100.0;
        }
        if (humidity < idealLow) {
            return Math.max(0.0, 100.0 - (idealLow - humidity) * 2.0);
        }
        return Math.max(0.0, 100.0 - (humidity - idealHigh) * 1.5);
    }

    private double windScore(double windMps) {
        double idealLow = 1.0;
        double idealHigh = 3.0;
        if (windMps >= idealLow && windMps <= idealHigh) {
            return 100.0;
        }
        if (windMps < idealLow) {
            return Math.max(0.0, 100.0 - (idealLow - windMps) * 60.0);
        }
        return Math.max(0.0, 100.0 - (windMps - idealHigh) * 15.0);
    }
}
