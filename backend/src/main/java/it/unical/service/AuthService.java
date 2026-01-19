package it.unical.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import it.unical.dto.GoogleCodeLoginRequest;
import it.unical.dto.GoogleLoginRequest;
import it.unical.dto.SignInRequest;
import it.unical.dto.SignUpRequest;
import it.unical.exception.FieldException;
import it.unical.model.User;
import it.unical.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final EmailVerificationService emailVerificationService;
    private final GoogleIdTokenVerifier googleIdTokenVerifier;
    private final String googleClientId;
    private final String googleClientSecret;
    private final String googleRedirectUri;

    public AuthService(UserRepository userRepo,
                       PasswordEncoder passwordEncoder,
                       EmailVerificationService emailVerificationService,
                       GoogleIdTokenVerifier googleIdTokenVerifier,
                       @Value("${app.google.client-id}") String googleClientId,
                       @Value("${app.google.client-secret}") String googleClientSecret,
                       @Value("${app.google.redirect-uri}") String googleRedirectUri) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.emailVerificationService = emailVerificationService;
        this.googleIdTokenVerifier = googleIdTokenVerifier;
        this.googleClientId = googleClientId;
        this.googleClientSecret = googleClientSecret;
        this.googleRedirectUri = googleRedirectUri;
    }

    public String register(SignUpRequest request) {
        if (userRepo.existsByEmail(request.getEmail())) {
            throw new FieldException("email", "Email già usata");
        }
        return emailVerificationService.createPendingRegistration(
                request.getName(),
                request.getEmail(),
                request.getBirthdate(),
                request.getPassword());
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

        String profileImageUrl = user.getProfileImage();
        if (profileImageUrl == null && user.getProfileImageData() != null) {
            profileImageUrl = "http://localhost:8080/api/users/" + user.getId() + "/image";
        }
        data.put("profileImage", profileImageUrl);
        data.put("isAdmin", String.valueOf(user.getIsAdmin()));

        return data;
    }

    public Map<String, String> loginWithGoogleCode(GoogleCodeLoginRequest request) {
        if (googleClientSecret == null || googleClientSecret.isBlank()) {
            throw new FieldException("google", "Configura GOOGLE_CLIENT_SECRET sul backend");
        }

        String idTokenString = exchangeCodeForIdToken(request.getCode());
        return handleGoogleIdToken(idTokenString);
    }

    private String exchangeCodeForIdToken(String code) {
        String tokenEndpoint = "https://oauth2.googleapis.com/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        String body = "code=" + urlEncode(code) +
                "&client_id=" + urlEncode(googleClientId) +
                "&client_secret=" + urlEncode(googleClientSecret) +
                "&redirect_uri=" + urlEncode(googleRedirectUri) +
                "&grant_type=authorization_code";

        HttpEntity<String> entity = new HttpEntity<>(body, headers);
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Map> response;

        try {
            response = restTemplate.exchange(tokenEndpoint, HttpMethod.POST, entity, Map.class);
        } catch (RestClientException e) {
            throw new FieldException("google", "Impossibile scambiare il codice Google");
        }

        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
            throw new FieldException("google", "Impossibile scambiare il codice Google");
        }

        Object idToken = response.getBody().get("id_token");
        if (idToken == null) {
            throw new FieldException("google", "Token Google non presente nella risposta");
        }
        return idToken.toString();
    }

    private String urlEncode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }

    private Map<String, String> handleGoogleIdToken(String idTokenString) {
        GoogleIdToken idToken;
        try {
            idToken = GoogleIdToken.parse(com.google.api.client.json.gson.GsonFactory.getDefaultInstance(),
                    idTokenString);
        } catch (Exception e) {
            throw new FieldException("google", "Token Google non valido");
        }

        if (idToken == null) {
            throw new FieldException("google", "Token Google non valido");
        }

        return processGoogleLogin(idToken);
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

        return processGoogleLogin(idToken);
    }

    private Map<String, String> processGoogleLogin(GoogleIdToken idToken) {
        Payload payload = idToken.getPayload();
        String email = payload.getEmail();
        Boolean emailVerified = (Boolean) payload.getOrDefault("email_verified", Boolean.FALSE);
        String nameFromGoogle = (String) payload.getOrDefault("name",
                (String) payload.getOrDefault("given_name", null));

        if (email == null || !emailVerified) {
            throw new FieldException("google", "Email Google non verificata o mancante");
        }

        String fallbackName = nameFromGoogle != null && !nameFromGoogle.isBlank()
                ? nameFromGoogle
                : email.split("@")[0];

        User user;
        boolean isNewUser = false;
        Optional<User> existingUser = userRepo.findByEmail(email);
        if (existingUser.isPresent()) {
            user = existingUser.get();
        } else {
            isNewUser = true;
            User u = new User();
            u.setEmail(email);
            u.setName(fallbackName);
            u.setPasswordHash("");

            String googleImgUrl = (String) payload.get("picture");
            if (googleImgUrl != null) {
                try {
                    byte[] imageBytes = new RestTemplate().getForObject(googleImgUrl, byte[].class);
                    byte[] resizedBytes = it.unical.utils.ImageUtility.resizeImage(imageBytes, 128, 128);
                    u.setProfileImageData(resizedBytes);
                } catch (Exception e) {
                    System.err.println("Impossibile scaricare immagine Google: " + e.getMessage());
                }
            }

            u = userRepo.save(u);

            if (u.getProfileImageData() != null) {
                u.setProfileImage("http://localhost:8080/api/users/" + u.getId() + "/image");
                userRepo.save(u);
            }

            user = u;
        }

        if (isNewUser) {
            emailVerificationService.sendWelcomeEmail(user);
        }

        if ((user.getName() == null || user.getName().isBlank()) && fallbackName != null) {
            user.setName(fallbackName);
            userRepo.save(user);
        }

        if (user.getProfileImageData() == null) {
            String googleImgUrl = (String) payload.get("picture");
            if (googleImgUrl != null) {
                try {
                    byte[] imageBytes = new RestTemplate().getForObject(googleImgUrl, byte[].class);
                    byte[] resizedBytes = it.unical.utils.ImageUtility.resizeImage(imageBytes, 128, 128);
                    user.setProfileImageData(resizedBytes);
                    user.setProfileImage("http://localhost:8080/api/users/" + user.getId() + "/image");
                    userRepo.save(user);
                } catch (Exception e) {
                    System.err.println("Impossibile scaricare immagine Google per utente esistente: " + e.getMessage());
                }
            }
        }

        Map<String, String> data = new HashMap<>();
        data.put("id", String.valueOf(user.getId()));
        data.put("name", user.getName());
        data.put("email", user.getEmail());

        String profileImageUrl = user.getProfileImage();
        if (profileImageUrl == null && user.getProfileImageData() != null) {
            profileImageUrl = "http://localhost:8080/api/users/" + user.getId() + "/image";
            user.setProfileImage(profileImageUrl);
            userRepo.save(user);
        }
        data.put("profileImage", profileImageUrl);
        data.put("isAdmin", String.valueOf(user.getIsAdmin()));

        return data;
    }
}

