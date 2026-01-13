package it.unical.repository;

import it.unical.model.ChatPoll;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatPollRepository extends JpaRepository<ChatPoll, Long> {
    List<ChatPoll> findByChat_IdOrderByCreatedAtDesc(Long chatId);

    Optional<ChatPoll> findByIdAndChat_Id(Long pollId, Long chatId);
}
