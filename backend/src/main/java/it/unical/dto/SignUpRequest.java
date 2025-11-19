package it.unical.dto;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public class SignUpRequest {

    @NotBlank
    private String name;

    @NotNull
    private String birthdate;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(min = 8)
    private String password;

    public String getName() { return name; }
    public String getBirthdate() { return birthdate; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }

    public void setName(String name) { this.name = name; }
    public void setBirthdate(String birthdate) { this.birthdate = birthdate; }
    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
}

