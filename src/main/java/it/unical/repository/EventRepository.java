package it.unical.repository;

import it.unical.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    // Qui dobbiamo mettere metodi aggiuntivi se servono per le query
}
