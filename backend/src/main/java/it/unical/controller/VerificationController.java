package it.unical.controller;

import it.unical.api.ApiResponse;
import it.unical.dto.ResendTokenRequest;
import it.unical.service.EmailVerificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class VerificationController {

    private final EmailVerificationService emailVerificationService;

    public VerificationController(EmailVerificationService emailVerificationService) {
        this.emailVerificationService = emailVerificationService;
    }

    // endpoint che il frontend chiama dopo il click sul link
    @GetMapping("/verify")
    public ResponseEntity<ApiResponse> verifyEmail(@RequestParam("token") String token) {
        try {
            emailVerificationService.verifyTokenAndCreateUser(token);
            return ResponseEntity.ok(ApiResponse.ok(null));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ApiResponse.fail(ex.getMessage()));
        }
    }

    @PostMapping("/resend-token")
    public ResponseEntity<ApiResponse> resendToken(@RequestBody(required = false) ResendTokenRequest request) {
        try {
            String newToken = emailVerificationService.resendVerification(
                    request != null ? request.getOldToken() : null,
                    request != null ? request.getEmail() : null
            );
            return ResponseEntity.ok(ApiResponse.ok(Map.of("token", newToken)));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ApiResponse.fail(ex.getMessage()));
        }
    }
}
