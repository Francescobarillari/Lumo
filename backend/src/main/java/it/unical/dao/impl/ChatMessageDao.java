package it.unical.dao.impl;

import it.unical.dao.base.DaoException;

import it.unical.model.ChatMessage;
import it.unical.model.EventChat;
import it.unical.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Repository
public class ChatMessageDao {
    private final DataSource dataSource;

    public ChatMessageDao(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public Page<ChatMessage> findByChat_IdOrderByCreatedAtDesc(Long chatId, Pageable pageable) {
        String sql = "SELECT m.id, m.chat_id, m.sender_id, m.content, m.created_at, "
                + "u.name, u.profile_image "
                + "FROM chat_message m "
                + "LEFT JOIN users u ON m.sender_id = u.id "
                + "WHERE m.chat_id = ? ORDER BY m.created_at DESC LIMIT ? OFFSET ?";
        List<ChatMessage> messages = new ArrayList<>();
        long total = countByChatId(chatId);
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, chatId);
            stmt.setInt(2, pageable.getPageSize());
            stmt.setInt(3, (int) pageable.getOffset());
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    messages.add(mapMessage(rs));
                }
            }
        } catch (SQLException ex) {
            throw new DaoException("ChatMessageDao.findByChat_IdOrderByCreatedAtDesc failed", ex);
        }
        return new PageImpl<>(messages, pageable, total);
    }

    public List<ChatMessage> findByChat_IdOrderByCreatedAtAsc(Long chatId) {
        String sql = "SELECT m.id, m.chat_id, m.sender_id, m.content, m.created_at, "
                + "u.name, u.profile_image "
                + "FROM chat_message m "
                + "LEFT JOIN users u ON m.sender_id = u.id "
                + "WHERE m.chat_id = ? ORDER BY m.created_at ASC";
        return fetchMessages(sql, stmt -> stmt.setLong(1, chatId));
    }

    public List<ChatMessage> findByChat_Event_IdOrderByCreatedAtAsc(Long eventId) {
        String sql = "SELECT m.id, m.chat_id, m.sender_id, m.content, m.created_at, "
                + "u.name, u.profile_image "
                + "FROM chat_message m "
                + "JOIN event_chat c ON c.id = m.chat_id "
                + "LEFT JOIN users u ON m.sender_id = u.id "
                + "WHERE c.event_id = ? ORDER BY m.created_at ASC";
        return fetchMessages(sql, stmt -> stmt.setLong(1, eventId));
    }

    public ChatMessage save(ChatMessage message) {
        if (message == null) {
            throw new IllegalArgumentException("ChatMessageDao.save message is null");
        }
        if (message.getId() == null) {
            insertMessage(message);
        } else {
            updateMessage(message);
        }
        return message;
    }

    private void insertMessage(ChatMessage message) {
        String sql = "INSERT INTO chat_message (chat_id, sender_id, content, created_at) VALUES (?, ?, ?, ?)";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setObject(1, message.getChat() != null ? message.getChat().getId() : null);
            stmt.setObject(2, message.getSender() != null ? message.getSender().getId() : null);
            stmt.setString(3, message.getContent());
            stmt.setObject(4, message.getCreatedAt());
            stmt.executeUpdate();
            try (ResultSet keys = stmt.getGeneratedKeys()) {
                if (keys.next()) {
                    message.setId(keys.getLong(1));
                }
            }
        } catch (SQLException ex) {
            throw new DaoException("ChatMessageDao.insertMessage failed", ex);
        }
    }

    private void updateMessage(ChatMessage message) {
        String sql = "UPDATE chat_message SET chat_id = ?, sender_id = ?, content = ?, created_at = ? WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setObject(1, message.getChat() != null ? message.getChat().getId() : null);
            stmt.setObject(2, message.getSender() != null ? message.getSender().getId() : null);
            stmt.setString(3, message.getContent());
            stmt.setObject(4, message.getCreatedAt());
            stmt.setLong(5, message.getId());
            stmt.executeUpdate();
        } catch (SQLException ex) {
            throw new DaoException("ChatMessageDao.updateMessage failed", ex);
        }
    }

    private interface StatementBinder {
        void bind(PreparedStatement stmt) throws SQLException;
    }

    private List<ChatMessage> fetchMessages(String sql, StatementBinder binder) {
        List<ChatMessage> messages = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            binder.bind(stmt);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    messages.add(mapMessage(rs));
                }
            }
            return messages;
        } catch (SQLException ex) {
            throw new DaoException("ChatMessageDao.fetchMessages failed", ex);
        }
    }

    private long countByChatId(Long chatId) {
        String sql = "SELECT COUNT(*) FROM chat_message WHERE chat_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, chatId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getLong(1);
                }
                return 0;
            }
        } catch (SQLException ex) {
            throw new DaoException("ChatMessageDao.countByChatId failed", ex);
        }
    }

    private ChatMessage mapMessage(ResultSet rs) throws SQLException {
        ChatMessage message = new ChatMessage();
        message.setId(rs.getLong("id"));

        Long chatId = (Long) rs.getObject("chat_id");
        if (chatId != null) {
            EventChat chat = new EventChat();
            chat.setId(chatId);
            message.setChat(chat);
        }

        Long senderId = (Long) rs.getObject("sender_id");
        if (senderId != null) {
            User sender = new User();
            sender.setId(senderId);
            sender.setName(rs.getString("name"));
            sender.setProfileImage(rs.getString("profile_image"));
            message.setSender(sender);
        }

        message.setContent(rs.getString("content"));
        message.setCreatedAt(rs.getObject("created_at", LocalDateTime.class));
        return message;
    }
}
