package org.manojtharindu11.comfortcastbackend.exception;

public class WeatherDataUnavailableException extends RuntimeException {
    public WeatherDataUnavailableException(String message) {
        super(message);
    }
}
