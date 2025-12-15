package it.unical.config;

import it.unical.model.User;
import it.unical.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminSeeder {

    @Bean
    CommandLineRunner initAdmin(UserRepository userRepo, PasswordEncoder passwordEncoder) {
        return args -> {
            User admin = userRepo.findByEmail("admin@lumo.com").orElse(new User());

            admin.setName("Lumo Admin");
            admin.setEmail("admin@lumo.com");
            // Password must satisfy >8 chars, uppercase, number, symbol
            // "LumoAdmin123!" fits this criteria.
            admin.setPasswordHash(passwordEncoder.encode("LumoAdmin123!"));
            admin.setIsAdmin(true);

            userRepo.save(admin);
            System.out.println("✅ Admin user ensured: admin@lumo.com / LumoAdmin123!");
        };
    }
}
