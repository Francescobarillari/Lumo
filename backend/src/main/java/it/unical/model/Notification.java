package it.unical.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    private String title;

    @Column(length = 1000)
    private String message;

    private String type;

    @Column()
    private Long relatedEventId;

    @Column()
    private Long relatedUserId;

    private boolean isRead = false;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Notification() {
    }

    public Notification(Long userId, String title, String message, String type) {
        this.userId = userId;
        this.title = title;
        this.message = message;
        this.type = type;
        this.createdAt = LocalDateTime.now();
    }

    public Notification(Long userId, String title, String message, String type, Long relatedEventId,
                        Long relatedUserId) {
        this.userId = userId;
        this.title = title;
        this.message = message;
        this.type = type;
        this.relatedEventId = relatedEventId;
        this.relatedUserId = relatedUserId;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public boolean getIsRead() {
        return isRead;
    }

    public void setIsRead(boolean isRead) {
        this.isRead = isRead;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Long getRelatedEventId() {
        return relatedEventId;
    }

    public void setRelatedEventId(Long relatedEventId) {
        this.relatedEventId = relatedEventId;
    }

    public Long getRelatedUserId() {
        return relatedUserId;
    }

    public void setRelatedUserId(Long relatedUserId) {
        this.relatedUserId = relatedUserId;
    }
}
