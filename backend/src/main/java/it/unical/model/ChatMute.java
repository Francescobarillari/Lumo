package it.unical.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_mute", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"chat_id", "user_id"})
})
public class ChatMute {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "chat_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private EventChat chat;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "muted_by")
    private User mutedBy;

    @Column(length = 300)
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
