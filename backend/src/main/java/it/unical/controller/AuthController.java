package it.unical.controller;

import it.unical.api.ApiResponse;
import it.unical.dto.*;
import it.unical.service.AuthService;
import it.unical.service.PasswordResetService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final PasswordResetService passwordResetService;

    public AuthController(AuthService authService, PasswordResetService passwordResetService) {
        this.authService = authService;
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse> signUp(@Valid @RequestBody SignUpRequest request) {
        String token = authService.register(request);
        return ResponseEntity.ok(ApiResponse.ok(Map.of("token", token)));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@Valid @RequestBody SignInRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(authService.login(request)));
    }

    @PostMapping("/login/google")
    public ResponseEntity<ApiResponse> loginWithGoogle(@Valid @RequestBody GoogleLoginRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(authService.loginWithGoogle(request)));
    }

    @PostMapping("/login/google/code")
    public ResponseEntity<ApiResponse> loginWithGoogleCode(@Valid @RequestBody GoogleCodeLoginRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(authService.loginWithGoogleCode(request)));
    }

    @PostMapping("/password-reset/request")
    public ResponseEntity<ApiResponse> requestPasswordReset(@Valid @RequestBody PasswordResetRequest request) {
        passwordResetService.requestPasswordReset(request.getEmail());
        return ResponseEntity.ok(ApiResponse.ok());
    }

    @PostMapping("/password-reset/confirm")
    public ResponseEntity<ApiResponse> confirmPasswordReset(@Valid @RequestBody PasswordResetConfirmRequest request) {
        passwordResetService.resetPassword(request.getToken(), request.getNewPassword());
        return ResponseEntity.ok(ApiResponse.ok());
    }


}
