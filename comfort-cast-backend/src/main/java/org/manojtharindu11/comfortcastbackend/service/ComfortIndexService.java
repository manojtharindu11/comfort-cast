package org.manojtharindu11.comfortcastbackend.service;

import org.springframework.stereotype.Service;

@Service
public class ComfortIndexService {

    private static final double TEMP_WEIGHT = 0.4;
    private static final double HUMIDITY_WEIGHT = 0.25;
    private static final double WIND_WEIGHT = 0.2;
    private static final double PRESSURE_WEIGHT = 0.15;

    public int compute(double tempC, double humidity, double windMps, double pressure) {
        double temperatureScore = temperatureScore(tempC);
        double humidityScore = humidityScore(humidity);
        double windScore = windScore(windMps);
        double pressureScore = pressureScore(pressure);

        double total = TEMP_WEIGHT * temperatureScore
                + HUMIDITY_WEIGHT * humidityScore
                + WIND_WEIGHT * windScore
                + PRESSURE_WEIGHT * pressureScore;

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

    private double pressureScore(double pressure) {
        double idealLow = 1005;
        double idealHigh = 1020;
        if (pressure >= idealLow && pressure <= idealHigh) {
            return 100.0;
        }
        if (pressure < idealLow) {
            return Math.max(0.0, 100.0 - (idealLow - pressure) * 2.0);
        }
        return Math.max(0.0, 100.0 - (pressure - idealHigh) * 2.0);
    }
}
