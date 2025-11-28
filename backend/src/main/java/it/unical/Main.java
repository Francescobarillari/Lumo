package it.unical;

import it.unical.model.User;
import it.unical.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class Main {

    public static void main(String[] args) {
        SpringApplication.run(Main.class, args);
    }

    @Bean
    CommandLineRunner init(UserRepository userRepository) {
        return args -> {
            if (userRepository.findByEmail("fra@example.com").isEmpty()) {
                User user = new User();
                user.setName("fra");
                user.setEmail("fra@example.com");
                userRepository.save(user);
            }

            userRepository.findAll()
                    .forEach(u -> System.out.println("User: " + u.getName() + ", Email: " + u.getEmail()));
        };
    }
}
