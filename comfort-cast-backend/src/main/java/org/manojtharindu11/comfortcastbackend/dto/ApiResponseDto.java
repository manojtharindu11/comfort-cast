package org.manojtharindu11.comfortcastbackend.dto;

public record ApiResponseDto<T>(String message, T data) {
}
