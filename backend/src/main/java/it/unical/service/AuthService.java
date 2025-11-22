package it.unical.service;

import it.unical.dto.SignInRequest;
import it.unical.dto.SignUpRequest;
import it.unical.exception.FieldException;
import it.unical.model.User;
import it.unical.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final EmailVerificationService emailVerificationService;

    public AuthService(UserRepository userRepo, PasswordEncoder passwordEncoder, EmailVerificationService emailVerificationService) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.emailVerificationService = emailVerificationService;
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
}
