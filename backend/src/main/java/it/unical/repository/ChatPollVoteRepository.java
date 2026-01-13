package it.unical.repository;

import it.unical.model.ChatPollVote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatPollVoteRepository extends JpaRepository<ChatPollVote, Long> {
    List<ChatPollVote> findByPoll_Id(Long pollId);

    void deleteByPoll_IdAndUser_Id(Long pollId, Long userId);
}
