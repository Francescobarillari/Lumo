package it.unical.model;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
public class EventChat {
    private Long id;
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Event event;

    private LocalDateTime createdAt;
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<ChatMessage> messages = new ArrayList<>();
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<ChatMute> mutes = new ArrayList<>();
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<ChatPoll> polls = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<ChatMessage> getMessages() {
        return messages;
    }

    public void setMessages(List<ChatMessage> messages) {
        this.messages = messages;
    }

    public List<ChatMute> getMutes() {
        return mutes;
    }

    public void setMutes(List<ChatMute> mutes) {
        this.mutes = mutes;
    }

    public List<ChatPoll> getPolls() {
        return polls;
    }

    public void setPolls(List<ChatPoll> polls) {
        this.polls = polls;
    }
}

