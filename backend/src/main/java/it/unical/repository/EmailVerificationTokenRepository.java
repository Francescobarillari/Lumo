package it.unical.repository;

import it.unical.model.EmailVerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmailVerificationTokenRepository
        extends JpaRepository<EmailVerificationToken, Long> {

    EmailVerificationToken findByToken(String token);
}
