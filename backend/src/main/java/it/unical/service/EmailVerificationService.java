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
public class VerificationService {

    private final EmailVerificationRepository verificationRepo;
    private final UserRepository userRepo;
    private final JavaMailSender mailSender;
    private final PasswordEncoder passwordEncoder; // per cautela, ma password già hashata in EmailVerification

    // TTL token (es. 24 ore)
    private static final long TOKEN_TTL_HOURS = 24;

    // FRONTEND URL da mettere in properties
    private final String frontendVerifyBaseUrl;

    public VerificationService(
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
        // leggi da property: ex. app.frontend.verify-url = http://localhost:4200/verify-email
        this.frontendVerifyBaseUrl = env.getProperty("app.frontend.verify-url", "http://localhost:4200/verify-email");
    }

    // Crea pending registration e invia email
    public void createPendingRegistration(String name, String email, String birthdate, String rawPassword) {
        // se esiste user definitivo -> errore
        if (userRepo.existsByEmail(email)) {
            throw new FieldException("email", "Email già usata");
        }
        // se esiste pending non usato -> sovrascrivi o rimuovi (qui sovrascriviamo)
        Optional<EmailVerification> existing = verificationRepo.findByEmailAndUsedFalse(email);
        existing.ifPresent(verificationRepo::delete);

        EmailVerification v = new EmailVerification();
        v.setEmail(email);
        v.setName(name);
        v.setBirthdate(birthdate);
        // Hash della password e salvataggio nella pending (per crear utente dopo verifica)
        v.setPasswordHash(passwordEncoder.encode(rawPassword));
        v.setToken(UUID.randomUUID().toString());
        v.setExpiresAt(LocalDateTime.now().plusHours(TOKEN_TTL_HOURS));
        v.setUsed(false);

        verificationRepo.save(v);

        // invia email (semplice)
        sendVerificationEmail(v);
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
        mailSender.send(msg);
    }

    // Metodo chiamato quando arriva token da frontend
    public void verifyTokenAndCreateUser(String token) {
        EmailVerification v = verificationRepo.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Token non valido"));

        if (v.isUsed()) throw new RuntimeException("Token già usato");
        if (v.getExpiresAt().isBefore(LocalDateTime.now())) throw new RuntimeException("Token scaduto");

        // ricontrolla che non esista già un user con quell'email
        if (userRepo.existsByEmail(v.getEmail())) {
            throw new RuntimeException("Email già usata");
        }

        // crea user definitivo
        User user = new User();
        user.setName(v.getName());
        user.setEmail(v.getEmail());
        user.setBirthdate(v.getBirthdate());
        user.setPasswordHash(v.getPasswordHash());
        userRepo.save(user);

        // marca token come usato (o elimina l'entità)
        v.setUsed(true);
        verificationRepo.save(v);
    }
}
