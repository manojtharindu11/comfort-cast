package org.manojtharindu11.comfortcastbackend.exception;

import lombok.extern.slf4j.Slf4j;
import org.manojtharindu11.comfortcastbackend.dto.ApiResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.RestClientException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(CityNotFoundException.class)
    public ResponseEntity<ApiResponseDto<Void>> handleCityNotFound(CityNotFoundException e) {
        log.warn("City not found: {}", e.getMessage());
        return buildErrorResponse(HttpStatus.NOT_FOUND, e.getMessage());
    }

    @ExceptionHandler(WeatherDataUnavailableException.class)
    public ResponseEntity<ApiResponseDto<Void>> handleWeatherUnavailable(WeatherDataUnavailableException e) {
        log.warn("Weather data unavailable: {}", e.getMessage());
        return buildErrorResponse(HttpStatus.BAD_GATEWAY, e.getMessage());
    }

    @ExceptionHandler(ExternalServiceException.class)
    public ResponseEntity<ApiResponseDto<Void>> handleExternal(ExternalServiceException e) {
        log.error("External service error: {}", e.getMessage(), e);
        return buildErrorResponse(HttpStatus.BAD_GATEWAY,
                "Weather provider is temporarily unavailable. Please try again later.");
    }

    @ExceptionHandler(RestClientException.class)
    public ResponseEntity<ApiResponseDto<Void>> handleRestClient(RestClientException e) {
        log.error("Rest client call failed", e);
        return buildErrorResponse(HttpStatus.BAD_GATEWAY,
                "Weather provider is temporarily unavailable. Please try again later.");
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ApiResponseDto<Void>> handleNotFound(NoResourceFoundException e) {
        return buildErrorResponse(HttpStatus.NOT_FOUND, "The requested resource was not found");
    }

    @ExceptionHandler({HttpMessageNotReadableException.class, MethodArgumentTypeMismatchException.class})
    public ResponseEntity<ApiResponseDto<Void>> handleBadRequest(Exception e) {
        log.warn("Invalid request: {}", e.getMessage());
        return buildErrorResponse(HttpStatus.BAD_REQUEST, "Invalid request");
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ApiResponseDto<Void>> handleMethodNotSupported(HttpRequestMethodNotSupportedException e) {
        log.warn("Method not supported: {}", e.getMessage());
        return buildErrorResponse(HttpStatus.METHOD_NOT_ALLOWED, "HTTP method not supported for this endpoint");
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponseDto<Void>> handleUnexpected(Exception e) {
        log.error("Unexpected error", e);
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                "An unexpected error occurred. Please try again later.");
    }

    private ResponseEntity<ApiResponseDto<Void>> buildErrorResponse(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(new ApiResponseDto<>(message, null));
    }
}
