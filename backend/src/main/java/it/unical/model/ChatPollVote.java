package it.unical.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_poll_vote", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"poll_id", "user_id", "option_id"})
})
public class ChatPollVote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "poll_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private ChatPoll poll;

    @ManyToOne
    @JoinColumn(name = "option_id")
    private ChatPollOption option;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDateTime createdAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ChatPoll getPoll() {
        return poll;
    }

    public void setPoll(ChatPoll poll) {
        this.poll = poll;
    }

    public ChatPollOption getOption() {
        return option;
    }

    public void setOption(ChatPollOption option) {
        this.option = option;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
