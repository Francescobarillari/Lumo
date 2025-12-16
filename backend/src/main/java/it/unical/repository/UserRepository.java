package it.unical.repository;

import it.unical.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Qui dobbiamo mettere metodi aggiuntivi se servono per le query
    boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);

    List<User> findByNameContainingIgnoreCase(String name);
}
