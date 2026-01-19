package it.unical.service;

import it.unical.model.PasswordResetToken;
import it.unical.model.User;
import it.unical.repository.PasswordResetTokenRepository;
import it.unical.repository.UserRepository;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PasswordResetService {

    private static final long TOKEN_TTL_HOURS = 2;

    private final PasswordResetTokenRepository resetRepo;
    private final UserRepository userRepo;
    private final JavaMailSender mailSender;
    private final PasswordEncoder passwordEncoder;
    private final String frontendResetBaseUrl;
    private final String fromAddress;

    public PasswordResetService(
            PasswordResetTokenRepository resetRepo,
            UserRepository userRepo,
            JavaMailSender mailSender,
            PasswordEncoder passwordEncoder,
            org.springframework.core.env.Environment env) {
        this.resetRepo = resetRepo;
        this.userRepo = userRepo;
        this.mailSender = mailSender;
        this.passwordEncoder = passwordEncoder;
        this.frontendResetBaseUrl = env.getProperty("app.frontend.reset-url", "http://localhost:4200/reset-password");
        this.fromAddress = env.getProperty("app.mail.from", "no-reply@lumo.com");
    }

    public void requestPasswordReset(String email) {
        if (email == null || email.isBlank()) {
            return;
        }

        User user = userRepo.findByEmail(email).orElse(null);
        if (user == null) {
            return;
        }

        resetRepo.findByEmailAndUsedFalse(email).ifPresent(resetRepo::delete);

        PasswordResetToken token = new PasswordResetToken();
        token.setEmail(email);
        token.setToken(UUID.randomUUID().toString());
        token.setExpiresAt(LocalDateTime.now().plusHours(TOKEN_TTL_HOURS));
        token.setUsed(false);
        resetRepo.save(token);

        sendResetEmail(user, token);
    }

    public void resetPassword(String tokenValue, String newPassword) {
        PasswordResetToken token = resetRepo.findByToken(tokenValue)
                .orElseThrow(() -> new RuntimeException("Token non valido"));

        if (token.isUsed()) {
            throw new RuntimeException("Token già usato");
        }
        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token scaduto");
        }

        User user = userRepo.findByEmail(token.getEmail())
                .orElseThrow(() -> new RuntimeException("Utente non trovato"));

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepo.save(user);

        token.setUsed(true);
        resetRepo.save(token);
    }

    private void sendResetEmail(User user, PasswordResetToken token) {
        String link = frontendResetBaseUrl + "?token=" + token.getToken();
        String name = user.getName() != null && !user.getName().isBlank() ? user.getName() : "utente";
        String subject = "Reset password LUMO";
        String text = "Ciao " + name + ",\n\n" +
                "hai richiesto il reset della password per il tuo account LUMO.\n" +
                "Clicca il link seguente per impostare una nuova password:\n\n" +
                link + "\n\n" +
                "Il link scade tra " + TOKEN_TTL_HOURS + " ore.\n\n" +
                "Se non hai richiesto questa operazione, ignora questa email.\n\n" +
                "Saluti,\nTeam LUMO";

        if (fromAddress == null || fromAddress.isBlank()) {
            throw new IllegalStateException("Configurazione SMTP mancante: MAIL_FROM non impostata");
        }
        if (mailSender instanceof JavaMailSenderImpl impl) {
            if (impl.getHost() == null || impl.getHost().isBlank()) {
                throw new IllegalStateException("Configurazione SMTP mancante: MAIL_HOST non impostata");
            }
        }

        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(user.getEmail());
        msg.setFrom(fromAddress);
        msg.setSubject(subject);
        msg.setText(text);
        System.out.println("Invio mail reset a: " + user.getEmail() + " link: " + link);
        mailSender.send(msg);
    }
}

