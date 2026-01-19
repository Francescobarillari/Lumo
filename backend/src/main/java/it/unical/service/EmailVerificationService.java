package it.unical.service;

import it.unical.exception.FieldException;
import it.unical.model.EmailVerification;
import it.unical.model.User;
import it.unical.dao.impl.EmailVerificationDao;
import it.unical.dao.impl.UserDao;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class EmailVerificationService {

    private final EmailVerificationDao verificationRepo;
    private final UserDao userRepo;
    private final JavaMailSender mailSender;
    private final PasswordEncoder passwordEncoder;
    private static final long TOKEN_TTL_HOURS = 24;
    private final String frontendVerifyBaseUrl;
    private final String fromAddress;

    public EmailVerificationService(
            EmailVerificationDao verificationRepo,
            UserDao userRepo,
            JavaMailSender mailSender,
            PasswordEncoder passwordEncoder,
            org.springframework.core.env.Environment env) {
        this.verificationRepo = verificationRepo;
        this.userRepo = userRepo;
        this.mailSender = mailSender;
        this.passwordEncoder = passwordEncoder;
        this.frontendVerifyBaseUrl = env.getProperty("app.frontend.verify-url", "http://localhost:4200/verify-email");
        this.fromAddress = env.getProperty("app.mail.from", "no-reply@lumo.com");
    }

    public String createPendingRegistration(String name, String email, String birthdate, String rawPassword) {
        if (userRepo.existsByEmail(email)) {
            throw new FieldException("email", "Email già usata");
        }
        Optional<EmailVerification> existing = verificationRepo.findByEmailAndUsedFalse(email);
        existing.ifPresent(verificationRepo::delete);

        EmailVerification v = new EmailVerification();
        v.setEmail(email);
        v.setName(name);
        v.setBirthdate(birthdate);
        v.setPasswordHash(passwordEncoder.encode(rawPassword));
        v.setToken(UUID.randomUUID().toString());
        v.setExpiresAt(LocalDateTime.now().plusHours(TOKEN_TTL_HOURS));
        v.setUsed(false);

        verificationRepo.save(v);

        sendVerificationEmail(v);
        return v.getToken();
    }

    private void sendVerificationEmail(EmailVerification v) {
        String link = frontendVerifyBaseUrl + "?token=" + v.getToken();
        String subject = "Verifica la tua email per LUMO";
        String text = "Ciao " + v.getName() + ",\n\n" +
                "grazie per esserti registrato a LUMO. Per completare la registrazione clicca il link seguente:\n\n" +
                link + "\n\n" +
                "Il link scade tra " + TOKEN_TTL_HOURS + " ore.\n\n" +
                "Se non hai richiesto questa registrazione, ignora questa email.\n\n" +
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
        msg.setTo(v.getEmail());
        msg.setFrom(fromAddress);
        msg.setSubject(subject);
        msg.setText(text);
        System.out.println("Invio mail a: " + v.getEmail() + " link: " + link);
        mailSender.send(msg);
    }

    public String resendVerification(String oldToken, String email) {
        EmailVerification v = null;

        if (oldToken != null && !oldToken.isBlank()) {
            v = verificationRepo.findByToken(oldToken).orElse(null);
        }

        if (v == null && email != null && !email.isBlank()) {
            v = verificationRepo.findByEmailAndUsedFalse(email).orElse(null);
        }

        if (v == null) {
            throw new RuntimeException("Registrazione non trovata o già verificata");
        }

        if (v.isUsed() || userRepo.existsByEmail(v.getEmail())) {
            throw new RuntimeException("Email già verificata");
        }

        v.setToken(UUID.randomUUID().toString());
        v.setExpiresAt(LocalDateTime.now().plusHours(TOKEN_TTL_HOURS));
        v.setUsed(false);
        verificationRepo.save(v);

        sendVerificationEmail(v);
        return v.getToken();
    }

    public User verifyTokenAndCreateUser(String token) {
        EmailVerification v = verificationRepo.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Token non valido"));

        if (v.isUsed())
            throw new RuntimeException("Token già usato");
        if (v.getExpiresAt().isBefore(LocalDateTime.now()))
            throw new RuntimeException("Token scaduto");

        if (userRepo.existsByEmail(v.getEmail())) {
            throw new RuntimeException("Email già usata");
        }

        User user = new User();
        user.setName(v.getName());
        user.setEmail(v.getEmail());
        user.setBirthdate(v.getBirthdate());
        user.setPasswordHash(v.getPasswordHash());
        user = userRepo.save(user);

        v.setUsed(true);
        verificationRepo.save(v);

        sendWelcomeEmail(user);

        return user;
    }

    public void sendWelcomeEmail(User user) {
        if (user == null || user.getEmail() == null || user.getEmail().isBlank()) {
            return;
        }

        if (fromAddress == null || fromAddress.isBlank()) {
            System.err.println("Welcome email skipped: MAIL_FROM not configured");
            return;
        }
        if (mailSender instanceof JavaMailSenderImpl impl) {
            if (impl.getHost() == null || impl.getHost().isBlank()) {
                System.err.println("Welcome email skipped: MAIL_HOST not configured");
                return;
            }
        }

        String name = user.getName() != null && !user.getName().isBlank() ? user.getName() : "there";
        String subject = "Welcome to LUMO!";
        String text = "Hi " + name + ",\n\n" +
                "Welcome to LUMO — you're all set to discover events, follow eventers, and share your own.\n\n" +
                "We're happy you're here.\n\n" +
                "See you on the map,\n" +
                "Team LUMO";

        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(user.getEmail());
            msg.setFrom(fromAddress);
            msg.setSubject(subject);
            msg.setText(text);
            mailSender.send(msg);
        } catch (Exception e) {
            System.err.println("Failed to send welcome email to " + user.getEmail() + ": " + e.getMessage());
        }
    }
}
