package it.unical.proxy;

import it.unical.dao.impl.ChatMessageDao;
import it.unical.dao.impl.ChatMuteDao;
import it.unical.dao.impl.ChatPollDao;
import it.unical.dao.impl.ChatPollOptionDao;
import it.unical.dao.impl.ChatPollVoteDao;
import it.unical.model.ChatMessage;
import it.unical.model.ChatMute;
import it.unical.model.ChatPoll;
import it.unical.model.EventChat;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class EventChatProxy extends EventChat {
    // Proxy che carica in modo lazy messaggi, mute e sondaggi della chat al primo accesso.
    private transient javax.sql.DataSource dataSource;
    private boolean messagesLoaded;
    private boolean mutesLoaded;
    private boolean pollsLoaded;

    public EventChatProxy() {
    }

    public EventChatProxy(javax.sql.DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public List<ChatMessage> getMessages() {
        // Getter "intercettato": se serve, carica i messaggi qui.
        ensureMessagesLoaded();
        return super.getMessages();
    }

    @Override
    public List<ChatMute> getMutes() {
        // Lazy load delle mute solo al primo accesso.
        ensureMutesLoaded();
        return super.getMutes();
    }

    @Override
    public List<ChatPoll> getPolls() {
        // Lazy load dei sondaggi solo quando richiesti.
        ensurePollsLoaded();
        return super.getPolls();
    }

    @Override
    public void setMessages(List<ChatMessage> messages) {
        messagesLoaded = true;
        List<ChatMessage> sanitized = new ArrayList<>();
        Map<Long, ChatMessage> byId = new LinkedHashMap<>();
        if (messages != null) {
            for (ChatMessage message : messages) {
                if (message == null) {
                    continue;
                }
                if (message.getChat() != null && !sameEntity(message.getChat().getId(), getId())) {
                    throw new IllegalArgumentException("ChatMessage linked to a different chat");
                }
                message.setChat(this);
                if (message.getId() == null) {
                    sanitized.add(message);
                } else {
                    byId.putIfAbsent(message.getId(), message);
                }
            }
        }
        sanitized.addAll(byId.values());
        super.setMessages(sanitized);
    }

    @Override
    public void setMutes(List<ChatMute> mutes) {
        mutesLoaded = true;
        List<ChatMute> sanitized = new ArrayList<>();
        Map<Long, ChatMute> byId = new LinkedHashMap<>();
        if (mutes != null) {
            for (ChatMute mute : mutes) {
                if (mute == null) {
                    continue;
                }
                if (mute.getChat() != null && !sameEntity(mute.getChat().getId(), getId())) {
                    throw new IllegalArgumentException("ChatMute linked to a different chat");
                }
                mute.setChat(this);
                if (mute.getId() == null) {
                    sanitized.add(mute);
                } else {
                    byId.putIfAbsent(mute.getId(), mute);
                }
            }
        }
        sanitized.addAll(byId.values());
        super.setMutes(sanitized);
    }

    @Override
    public void setPolls(List<ChatPoll> polls) {
        pollsLoaded = true;
        List<ChatPoll> sanitized = new ArrayList<>();
        Map<Long, ChatPoll> byId = new LinkedHashMap<>();
        if (polls != null) {
            for (ChatPoll poll : polls) {
                if (poll == null) {
                    continue;
                }
                if (poll.getChat() != null && !sameEntity(poll.getChat().getId(), getId())) {
                    throw new IllegalArgumentException("ChatPoll linked to a different chat");
                }
                poll.setChat(this);
                if (poll.getId() == null) {
                    sanitized.add(poll);
                } else {
                    byId.putIfAbsent(poll.getId(), poll);
                }
            }
        }
        sanitized.addAll(byId.values());
        super.setPolls(sanitized);
    }

    private void ensureMessagesLoaded() {
        if (messagesLoaded) {
            return;
        }
        messagesLoaded = true;
        if (!canLazyLoad()) {
            if (super.getMessages() == null) {
                super.setMessages(new ArrayList<>());
            }
            return;
        }
        List<ChatMessage> messages = new ChatMessageDao(dataSource)
                .findByChat_IdOrderByCreatedAtAsc(getId());
        setMessages(messages);
    }

    private void ensureMutesLoaded() {
        if (mutesLoaded) {
            return;
        }
        mutesLoaded = true;
        if (!canLazyLoad()) {
            if (super.getMutes() == null) {
                super.setMutes(new ArrayList<>());
            }
            return;
        }
        List<ChatMute> mutes = new ChatMuteDao(dataSource).findByChat_Id(getId());
        setMutes(mutes);
    }

    private void ensurePollsLoaded() {
        if (pollsLoaded) {
            return;
        }
        pollsLoaded = true;
        if (!canLazyLoad()) {
            if (super.getPolls() == null) {
                super.setPolls(new ArrayList<>());
            }
            return;
        }
        ChatPollOptionDao optionDao = new ChatPollOptionDao(dataSource);
        ChatPollVoteDao voteDao = new ChatPollVoteDao(dataSource);
        List<ChatPoll> polls = new ChatPollDao(dataSource, optionDao, voteDao)
                .findByChat_IdOrderByCreatedAtDesc(getId());
        setPolls(polls);
    }

    private boolean canLazyLoad() {
        return dataSource != null && getId() != null;
    }

    private boolean sameEntity(Long leftId, Long rightId) {
        return leftId == null || rightId == null || leftId.equals(rightId);
    }
}
