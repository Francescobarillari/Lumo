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

    @GetMapping("/verify")
    public ResponseEntity<ApiResponse> verifyEmail(@RequestParam("token") String token) {
        try {
            var user = emailVerificationService.verifyTokenAndCreateUser(token);
            Map<String, String> data = Map.of(
                    "id", String.valueOf(user.getId()),
                    "name", user.getName(),
                    "email", user.getEmail());
            return ResponseEntity.ok(ApiResponse.ok(data));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ApiResponse.fail(ex.getMessage()));
        }
    }

    @PostMapping("/resend-token")
    public ResponseEntity<ApiResponse> resendToken(@RequestBody(required = false) ResendTokenRequest request) {
        try {
            String newToken = emailVerificationService.resendVerification(
                    request != null ? request.getOldToken() : null,
                    request != null ? request.getEmail() : null);
            return ResponseEntity.ok(ApiResponse.ok(Map.of("token", newToken)));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ApiResponse.fail(ex.getMessage()));
        }
    }
}
