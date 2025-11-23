package it.unical.dto;

import jakarta.validation.constraints.NotBlank;

public class GoogleCodeLoginRequest {

    @NotBlank(message = "Codice Google mancante")
    private String code;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
