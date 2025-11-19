package it.unical.controller;

import it.unical.api.ApiResponse;
import it.unical.dto.SignUpRequest;
import it.unical.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse> signUp(@Valid @RequestBody SignUpRequest request) {
        authService.register(request);
        return ResponseEntity.ok(ApiResponse.ok());
    }


}

