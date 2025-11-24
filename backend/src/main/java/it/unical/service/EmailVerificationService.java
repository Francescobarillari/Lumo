package it.unical.service;

import it.unical.exception.FieldException;
import it.unical.model.EmailVerification;
import it.unical.model.User;
import it.unical.repository.EmailVerificationRepository;
import it.unical.repository.UserRepository;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class EmailVerificationService {

    private final EmailVerificationRepository verificationRepo;
    private final UserRepository userRepo;
    private final JavaMailSender mailSender;
    private final PasswordEncoder passwordEncoder; // per cautela, ma password già hashata in EmailVerification
    private static final long TOKEN_TTL_HOURS = 24;
    private final String frontendVerifyBaseUrl;

    public EmailVerificationService(
            EmailVerificationRepository verificationRepo,
            UserRepository userRepo,
            JavaMailSender mailSender,
            PasswordEncoder passwordEncoder,
            org.springframework.core.env.Environment env
    ) {
        this.verificationRepo = verificationRepo;
        this.userRepo = userRepo;
        this.mailSender = mailSender;
        this.passwordEncoder = passwordEncoder;
        this.frontendVerifyBaseUrl = env.getProperty("app.frontend.verify-url", "http://localhost:4200/verify-email");
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

        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(v.getEmail());
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

    public void verifyTokenAndCreateUser(String token) {
        EmailVerification v = verificationRepo.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Token non valido"));

        if (v.isUsed()) throw new RuntimeException("Token già usato");
        if (v.getExpiresAt().isBefore(LocalDateTime.now())) throw new RuntimeException("Token scaduto");

        if (userRepo.existsByEmail(v.getEmail())) {
            throw new RuntimeException("Email già usata");
        }


        User user = new User();
        user.setName(v.getName());
        user.setEmail(v.getEmail());
        user.setBirthdate(v.getBirthdate());
        user.setPasswordHash(v.getPasswordHash());
        userRepo.save(user);

        v.setUsed(true);
        verificationRepo.save(v);
    }
}
