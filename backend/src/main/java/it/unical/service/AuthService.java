package it.unical.service;

import it.unical.dto.SignInRequest;
import it.unical.dto.SignUpRequest;
import it.unical.dto.GoogleLoginRequest;
import it.unical.exception.FieldException;
import it.unical.model.User;
import it.unical.repository.UserRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final EmailVerificationService emailVerificationService;
    private final GoogleIdTokenVerifier googleIdTokenVerifier;

    public AuthService(UserRepository userRepo,
                       PasswordEncoder passwordEncoder,
                       EmailVerificationService emailVerificationService,
                       GoogleIdTokenVerifier googleIdTokenVerifier) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.emailVerificationService = emailVerificationService;
        this.googleIdTokenVerifier = googleIdTokenVerifier;
    }

    public void register(SignUpRequest request) {
        if (userRepo.existsByEmail(request.getEmail())) {
            throw new FieldException("email", "Email già usata");
        }
        emailVerificationService.createPendingRegistration(
            request.getName(),
            request.getEmail(),
            request.getBirthdate(),

            request.getPassword()
        );
    }

    public Map<String, String> login(SignInRequest request) {
        User user = userRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new FieldException("email", "Email o password errati"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new FieldException("password", "Email o password errati");
        }

        Map<String, String> data = new HashMap<>();
        data.put("id", String.valueOf(user.getId()));
        data.put("name", user.getName());
        data.put("email", user.getEmail());

        return data;
    }

    public Map<String, String> loginWithGoogle(GoogleLoginRequest request) {
        GoogleIdToken idToken;
        try {
            idToken = googleIdTokenVerifier.verify(request.getIdToken());
        } catch (Exception e) {
            throw new FieldException("google", "Token Google non valido");
        }

        if (idToken == null) {
            throw new FieldException("google", "Token Google non valido");
        }

        Payload payload = idToken.getPayload();
        String email = payload.getEmail();
        Boolean emailVerified = (Boolean) payload.getOrDefault("email_verified", Boolean.FALSE);

        if (email == null || !emailVerified) {
            throw new FieldException("google", "Email Google non verificata o mancante");
        }

        User user = userRepo.findByEmail(email).orElseGet(() -> {
            User u = new User();
            u.setEmail(email);
            u.setName((String) payload.getOrDefault("name", (String) payload.get("given_name")));
            u.setPasswordHash(""); // accesso tramite Google, nessuna password locale
            return userRepo.save(u);
        });

        Map<String, String> data = new HashMap<>();
        data.put("id", String.valueOf(user.getId()));
        data.put("name", user.getName());
        data.put("email", user.getEmail());

        return data;
    }
}
