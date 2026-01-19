package it.unical.model;

import java.time.LocalDateTime;

public class ChatPollVote {
    private Long id;

    @com.fasterxml.jackson.annotation.JsonIgnore
    private ChatPoll poll;

    private ChatPollOption option;
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
