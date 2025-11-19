package it.unical.service;

import it.unical.model.EmailVerificationToken;
import it.unical.model.User;
import it.unical.repository.EmailVerificationTokenRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class EmailVerificationTokenService {

    private final EmailVerificationTokenRepository tokenRepo;

    public EmailVerificationTokenService(EmailVerificationTokenRepository tokenRepo) {
        this.tokenRepo = tokenRepo;
    }

    public EmailVerificationToken createToken(User user) {
        EmailVerificationToken token = new EmailVerificationToken();

        token.setUser(user);
        token.setToken(UUID.randomUUID().toString());
        token.setCreatedAt(LocalDateTime.now());
        token.setExpiresAt(LocalDateTime.now().plusMinutes(30));

        return tokenRepo.save(token);
    }
}
