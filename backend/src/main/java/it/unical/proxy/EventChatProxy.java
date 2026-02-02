package it.unical.proxy;

import it.unical.model.ChatMessage;
import it.unical.model.ChatMute;
import it.unical.model.ChatPoll;
import it.unical.model.EventChat;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class EventChatProxy extends EventChat {
    public EventChatProxy() {
    }

    public EventChatProxy(javax.sql.DataSource ignored) {
        // Kept for backward compatibility with existing constructors in DAOs/proxies.
    }

    @Override
    public void setMessages(List<ChatMessage> messages) {
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

    private boolean sameEntity(Long leftId, Long rightId) {
        return leftId == null || rightId == null || leftId.equals(rightId);
    }
}
