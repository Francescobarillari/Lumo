package it.unical.repository;

import it.unical.model.ChatMute;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatMuteRepository extends JpaRepository<ChatMute, Long> {
    Optional<ChatMute> findByChat_IdAndUser_Id(Long chatId, Long userId);

    List<ChatMute> findByChat_Id(Long chatId);
}
