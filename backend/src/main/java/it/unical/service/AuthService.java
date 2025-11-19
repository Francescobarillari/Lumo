package it.unical.service;

import it.unical.dto.SignUpRequest;
import it.unical.exception.FieldException;
import it.unical.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
}
