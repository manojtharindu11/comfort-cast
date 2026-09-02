package org.manojtharindu11.comfortcastbackend.exception;

public class CityNotFoundException extends RuntimeException {
    public CityNotFoundException(String cityCode) {
        super("Unknown city code: " + cityCode);
    }
}
