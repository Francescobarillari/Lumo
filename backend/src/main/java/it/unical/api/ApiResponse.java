package it.unical.api;

import java.util.Map;

public class ApiResponse {

    private final boolean success;
    private final Map<String, String> data;
    private final String error;

    private ApiResponse(boolean success, Map<String, String> data, String error) {
        this.success = success;
        this.data = data;
        this.error = error;
    }

    public static ApiResponse ok() {
        return new ApiResponse(true, null, null);
    }

    public static ApiResponse ok(Map<String, String> data) {
        return new ApiResponse(true, data, null);
    }

    public static ApiResponse fail(String error) {
        return new ApiResponse(false, null, error);
    }

    public static ApiResponse fail(Map<String, String> fieldErrors) {
        return new ApiResponse(false, fieldErrors, null);
    }

    public boolean isSuccess() { return success; }
    public Map<String, String> getData() { return data; }
    public String getError() { return error; }
}
