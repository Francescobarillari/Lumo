package it.unical.model;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
public class ChatPoll {
    private Long id;
    @com.fasterxml.jackson.annotation.JsonIgnore
    private EventChat chat;

    private String question;

    private LocalDateTime createdAt;

    private LocalDateTime endsAt;

    private Boolean isClosed = false;
    private User createdBy;
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<ChatPollOption> options = new ArrayList<>();
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<ChatPollVote> votes = new ArrayList<>();

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

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getEndsAt() {
        return endsAt;
    }

    public void setEndsAt(LocalDateTime endsAt) {
        this.endsAt = endsAt;
    }

    public Boolean getIsClosed() {
        return isClosed != null ? isClosed : false;
    }

    public void setIsClosed(Boolean closed) {
        isClosed = closed;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    public List<ChatPollOption> getOptions() {
        return options;
    }

    public void setOptions(List<ChatPollOption> options) {
        this.options = options;
    }

    public List<ChatPollVote> getVotes() {
        return votes;
    }

    public void setVotes(List<ChatPollVote> votes) {
        this.votes = votes;
    }
}

