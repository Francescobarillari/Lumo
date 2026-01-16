package it.unical.exception;

import it.unical.api.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            errors.put(fieldError.getField(), fieldError.getDefaultMessage());
        }
        return ApiResponse.fail(errors);
    }

    @ExceptionHandler(FieldException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse handleFieldException(FieldException ex) {
        Map<String, String> errors = new HashMap<>();
        errors.put(ex.getField(), ex.getMessage());
        return ApiResponse.fail(errors);
    }

    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse handleRuntime(RuntimeException ex) {
        return ApiResponse.fail(ex.getMessage());
    }
}
