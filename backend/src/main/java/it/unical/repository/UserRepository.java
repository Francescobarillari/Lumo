package it.unical.repository;

import it.unical.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Qui dobbiamo mettere metodi aggiuntivi se servono per le query
    boolean existsByEmail(String email);
}


