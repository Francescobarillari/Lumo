package it.unical.dao.impl;

import it.unical.dao.base.DaoException;

import it.unical.model.Event;
import it.unical.model.EventChat;
import it.unical.proxy.EventChatProxy;
import it.unical.proxy.EventProxy;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public class EventChatDao {
    private final DataSource dataSource;

    public EventChatDao(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public Optional<EventChat> findByEvent_Id(Long eventId) {
        String sql = "SELECT id, event_id, created_at FROM event_chat WHERE event_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, eventId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapChat(rs));
                }
                return Optional.empty();
            }
        } catch (SQLException ex) {
            throw new DaoException("EventChatDao.findByEvent_Id failed", ex);
        }
    }

    public EventChat save(EventChat chat) {
        if (chat == null) {
            throw new IllegalArgumentException("EventChatDao.save chat is null");
        }
        if (chat.getId() == null) {
            insertChat(chat);
        } else {
            updateChat(chat);
        }
        return chat;
    }

    public void delete(EventChat chat) {
        if (chat == null || chat.getId() == null) {
            return;
        }
        deleteById(chat.getId());
    }

    public void deleteById(Long id) {
        String sql = "DELETE FROM event_chat WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, id);
            stmt.executeUpdate();
        } catch (SQLException ex) {
            throw new DaoException("EventChatDao.deleteById failed", ex);
        }
    }

    private void insertChat(EventChat chat) {
        Long eventId = chat.getEvent() != null ? chat.getEvent().getId() : null;
        if (eventId == null) {
            throw new IllegalArgumentException("EventChatDao.insertChat event id is null");
        }

        // Enforce 1:1 cardinality between event and chat at DAO level.
        String checkSql = "SELECT id FROM event_chat WHERE event_id = ?";
        String sql = "INSERT INTO event_chat (event_id, created_at) VALUES (?, ?)";
        try (Connection conn = dataSource.getConnection()) {
            try (PreparedStatement checkStmt = conn.prepareStatement(checkSql)) {
                checkStmt.setLong(1, eventId);
                try (ResultSet rs = checkStmt.executeQuery()) {
                    if (rs.next()) {
                        throw new DaoException(
                                "EventChatDao.insertChat failed: event already has a chat",
                                new IllegalStateException("1:1 cardinality violation for event_chat.event_id"));
                    }
                }
            }

            try (PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
                stmt.setLong(1, eventId);
                stmt.setObject(2, chat.getCreatedAt());
                stmt.executeUpdate();
                try (ResultSet keys = stmt.getGeneratedKeys()) {
                    if (keys.next()) {
                        chat.setId(keys.getLong(1));
                    }
                }
            }
        } catch (SQLException ex) {
            throw new DaoException("EventChatDao.insertChat failed", ex);
        }
    }

    private void updateChat(EventChat chat) {
        Long eventId = chat.getEvent() != null ? chat.getEvent().getId() : null;
        if (eventId == null) {
            throw new IllegalArgumentException("EventChatDao.updateChat event id is null");
        }

        String checkSql = "SELECT id FROM event_chat WHERE event_id = ? AND id <> ?";
        String sql = "UPDATE event_chat SET event_id = ?, created_at = ? WHERE id = ?";
        try (Connection conn = dataSource.getConnection()) {
            try (PreparedStatement checkStmt = conn.prepareStatement(checkSql)) {
                checkStmt.setLong(1, eventId);
                checkStmt.setLong(2, chat.getId());
                try (ResultSet rs = checkStmt.executeQuery()) {
                    if (rs.next()) {
                        throw new DaoException(
                                "EventChatDao.updateChat failed: event already linked to another chat",
                                new IllegalStateException("1:1 cardinality violation for event_chat.event_id"));
                    }
                }
            }

            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                stmt.setLong(1, eventId);
                stmt.setObject(2, chat.getCreatedAt());
                stmt.setLong(3, chat.getId());
                stmt.executeUpdate();
            }
        } catch (SQLException ex) {
            throw new DaoException("EventChatDao.updateChat failed", ex);
        }
    }

    private EventChat mapChat(ResultSet rs) throws SQLException {
        // Usa il proxy per caricare lazy messaggi/mute/sondaggi della chat al bisogno.
        EventChat chat = new EventChatProxy(dataSource);
        chat.setId(rs.getLong("id"));
        Long eventId = (Long) rs.getObject("event_id");
        if (eventId != null) {
            // Usa il proxy per caricare lazy le relazioni dell'evento al bisogno.
            Event event = new EventProxy(dataSource);
            event.setId(eventId);
            chat.setEvent(event);
        }
        chat.setCreatedAt(rs.getObject("created_at", LocalDateTime.class));
        return chat;
    }
}
