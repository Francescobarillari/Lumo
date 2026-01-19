package it.unical.proxy;

import it.unical.dao.base.DaoException;
import it.unical.model.ChatMessage;
import it.unical.model.ChatMute;
import it.unical.model.ChatPoll;
import it.unical.model.EventChat;
import it.unical.model.User;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class EventChatProxy extends EventChat {
    private final DataSource dataSource;

    public EventChatProxy(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public List<ChatMessage> getMessages() {
        List<ChatMessage> messages = super.getMessages();
        if (messages == null || messages.isEmpty()) {
            messages = loadMessages();
            super.setMessages(messages);
        }
        return messages;
    }

    @Override
    public List<ChatMute> getMutes() {
        List<ChatMute> mutes = super.getMutes();
        if (mutes == null || mutes.isEmpty()) {
            mutes = loadMutes();
            super.setMutes(mutes);
        }
        return mutes;
    }

    @Override
    public List<ChatPoll> getPolls() {
        List<ChatPoll> polls = super.getPolls();
        if (polls == null || polls.isEmpty()) {
            polls = loadPolls();
            super.setPolls(polls);
        }
        return polls;
    }

    private List<ChatMessage> loadMessages() {
        List<ChatMessage> messages = new ArrayList<>();
        if (dataSource == null || getId() == null) {
            return messages;
        }
        String sql = "SELECT m.id, m.chat_id, m.sender_id, m.content, m.created_at, "
                + "u.name, u.profile_image "
                + "FROM chat_message m "
                + "LEFT JOIN users u ON m.sender_id = u.id "
                + "WHERE m.chat_id = ? ORDER BY m.created_at ASC";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, getId());
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    messages.add(mapMessage(rs));
                }
            }
        } catch (SQLException ex) {
            throw new DaoException("EventChatProxy.loadMessages failed", ex);
        }
        return messages;
    }

    private List<ChatMute> loadMutes() {
        List<ChatMute> mutes = new ArrayList<>();
        if (dataSource == null || getId() == null) {
            return mutes;
        }
        String sql = "SELECT m.id, m.chat_id, m.user_id, m.muted_by, m.reason, m.created_at, "
                + "u.name as user_name, mb.name as muted_by_name "
                + "FROM chat_mute m "
                + "LEFT JOIN users u ON m.user_id = u.id "
                + "LEFT JOIN users mb ON m.muted_by = mb.id "
                + "WHERE m.chat_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, getId());
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    mutes.add(mapMute(rs));
                }
            }
        } catch (SQLException ex) {
            throw new DaoException("EventChatProxy.loadMutes failed", ex);
        }
        return mutes;
    }

    private List<ChatPoll> loadPolls() {
        List<ChatPoll> polls = new ArrayList<>();
        if (dataSource == null || getId() == null) {
            return polls;
        }
        String sql = "SELECT id, chat_id, question, created_at, ends_at, is_closed, created_by "
                + "FROM chat_poll WHERE chat_id = ? ORDER BY created_at DESC";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, getId());
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    polls.add(mapPoll(rs));
                }
            }
        } catch (SQLException ex) {
            throw new DaoException("EventChatProxy.loadPolls failed", ex);
        }
        return polls;
    }

    private ChatMessage mapMessage(ResultSet rs) throws SQLException {
        ChatMessage message = new ChatMessage();
        message.setId(rs.getLong("id"));
        message.setChat(this);

        Long senderId = (Long) rs.getObject("sender_id");
        if (senderId != null) {
            User sender = new UserProxy(dataSource);
            sender.setId(senderId);
            sender.setName(rs.getString("name"));
            sender.setProfileImage(rs.getString("profile_image"));
            message.setSender(sender);
        }

        message.setContent(rs.getString("content"));
        message.setCreatedAt(rs.getObject("created_at", LocalDateTime.class));
        return message;
    }

    private ChatMute mapMute(ResultSet rs) throws SQLException {
        ChatMute mute = new ChatMute();
        mute.setId(rs.getLong("id"));
        mute.setChat(this);

        Long userId = (Long) rs.getObject("user_id");
        if (userId != null) {
            User user = new UserProxy(dataSource);
            user.setId(userId);
            user.setName(rs.getString("user_name"));
            mute.setUser(user);
        }

        Long mutedById = (Long) rs.getObject("muted_by");
        if (mutedById != null) {
            User mutedBy = new UserProxy(dataSource);
            mutedBy.setId(mutedById);
            mutedBy.setName(rs.getString("muted_by_name"));
            mute.setMutedBy(mutedBy);
        }

        mute.setReason(rs.getString("reason"));
        mute.setCreatedAt(rs.getObject("created_at", LocalDateTime.class));
        return mute;
    }

    private ChatPoll mapPoll(ResultSet rs) throws SQLException {
        ChatPoll poll = new ChatPollProxy(dataSource);
        poll.setId(rs.getLong("id"));
        poll.setChat(this);
        poll.setQuestion(rs.getString("question"));
        poll.setCreatedAt(rs.getObject("created_at", LocalDateTime.class));
        poll.setEndsAt(rs.getObject("ends_at", LocalDateTime.class));
        poll.setIsClosed(rs.getBoolean("is_closed"));
        Long creatorId = (Long) rs.getObject("created_by");
        if (creatorId != null) {
            User creator = new UserProxy(dataSource);
            creator.setId(creatorId);
            poll.setCreatedBy(creator);
        }
        return poll;
    }
}
