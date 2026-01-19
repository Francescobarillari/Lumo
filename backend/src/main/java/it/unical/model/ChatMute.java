package it.unical.model;

import java.time.LocalDateTime;

public class ChatMute {
    private Long id;

    @com.fasterxml.jackson.annotation.JsonIgnore
    private EventChat chat;

    private User user;
    private User mutedBy;
    private String reason;

    private LocalDateTime createdAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public EventChat getChat() {
        return chat;
    }

    public void setChat(EventChat chat) {
        this.chat = chat;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public User getMutedBy() {
        return mutedBy;
    }

    public void setMutedBy(User mutedBy) {
        this.mutedBy = mutedBy;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
