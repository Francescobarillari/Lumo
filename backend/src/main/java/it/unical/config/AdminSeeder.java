package it.unical.config;

import it.unical.model.User;
import it.unical.dao.impl.UserDao;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminSeeder {

    @Bean
    CommandLineRunner initAdmin(UserDao userRepo, PasswordEncoder passwordEncoder) {
        return args -> {
            User admin = userRepo.findByEmail("admin@lumo.com").orElse(new User());

            admin.setName("Lumo Admin");
            admin.setEmail("admin@lumo.com");
            // Password di seed, da cambiare in produzione.
            admin.setPasswordHash(passwordEncoder.encode("LumoAdmin123!"));
            admin.setIsAdmin(true);

            userRepo.save(admin);
            System.out.println("✅ Admin user ensured: admin@lumo.com / LumoAdmin123!");
        };
    }
}
