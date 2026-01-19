package it.unical.model;
public class ChatPollOption {
    private Long id;
    @com.fasterxml.jackson.annotation.JsonIgnore
    private ChatPoll poll;

    private String text;

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

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}

