package it.unical.service;

import it.unical.model.EmailVerificationToken;
import it.unical.model.User;
import it.unical.dao.impl.EmailVerificationTokenDao;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class EmailVerificationTokenService {

    private final EmailVerificationTokenDao tokenRepo;

    public EmailVerificationTokenService(EmailVerificationTokenDao tokenRepo) {
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
