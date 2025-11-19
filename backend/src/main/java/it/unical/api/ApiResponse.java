package it.unical.api;

import java.util.Map;

public class ApiResponse {

    private boolean success;
    private Map<String, String> data; // mappa campo -> messaggio (per errori) o null se successo
    private String error; // messaggio generico

    // Costruttore privato per controllare l’inizializzazione
    private ApiResponse(boolean success, Map<String, String> data, String error) {
        this.success = success;
        this.data = data;
        this.error = error;
    }

    // Successo generico
    public static ApiResponse ok() {
        return new ApiResponse(true, null, null);
    }

    // Successo con dati
    public static ApiResponse ok(Map<String, String> data) {
        return new ApiResponse(true, data, null);
    }

    // Fallimento generico
    public static ApiResponse fail(String error) {
        return new ApiResponse(false, null, error);
    }

    // Fallimento con mappa di errori per i campi
    public static ApiResponse fail(Map<String, String> fieldErrors) {
        return new ApiResponse(false, fieldErrors, null);
    }

    public boolean isSuccess() { return success; }
    public Map<String, String> getData() { return data; }
    public String getError() { return error; }
}
