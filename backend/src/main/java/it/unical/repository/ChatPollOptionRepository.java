package it.unical.repository;

import it.unical.model.ChatPollOption;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatPollOptionRepository extends JpaRepository<ChatPollOption, Long> {
    List<ChatPollOption> findByPoll_Id(Long pollId);
}
