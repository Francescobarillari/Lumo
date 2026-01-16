package it.unical.repository;

import it.unical.model.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    Page<ChatMessage> findByChat_IdOrderByCreatedAtDesc(Long chatId, Pageable pageable);

    List<ChatMessage> findByChat_IdOrderByCreatedAtAsc(Long chatId);

    List<ChatMessage> findByChat_Event_IdOrderByCreatedAtAsc(Long eventId);
}
