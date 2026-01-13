package it.unical.repository;

import it.unical.model.EventChat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EventChatRepository extends JpaRepository<EventChat, Long> {
    Optional<EventChat> findByEvent_Id(Long eventId);
}
