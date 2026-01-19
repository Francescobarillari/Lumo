package it.unical.dao.impl;

import it.unical.dao.base.DaoException;

import it.unical.model.Notification;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class NotificationDao {
    private final DataSource dataSource;

    public NotificationDao(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId) {
        String sql = "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC";
        List<Notification> notifications = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, userId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    notifications.add(mapNotification(rs));
                }
            }
            return notifications;
        } catch (SQLException ex) {
            throw new DaoException("NotificationDao.findByUserIdOrderByCreatedAtDesc failed", ex);
        }
    }

    public void deleteByUserIdAndIsReadTrue(Long userId) {
        String sql = "DELETE FROM notifications WHERE user_id = ? AND is_read = true";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, userId);
            stmt.executeUpdate();
        } catch (SQLException ex) {
            throw new DaoException("NotificationDao.deleteByUserIdAndIsReadTrue failed", ex);
        }
    }

    public void deleteByUserIdAndRelatedEventIdAndRelatedUserIdAndType(Long userId, Long relatedEventId,
                                                                       Long relatedUserId, String type) {
        String sql = "DELETE FROM notifications WHERE user_id = ? AND related_event_id = ? AND related_user_id = ? "
                + "AND type = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, userId);
            stmt.setLong(2, relatedEventId);
            stmt.setLong(3, relatedUserId);
            stmt.setString(4, type);
            stmt.executeUpdate();
        } catch (SQLException ex) {
            throw new DaoException("NotificationDao.deleteByUserIdAndRelatedEventIdAndRelatedUserIdAndType failed", ex);
        }
    }

    public Optional<Notification> findById(Long id) {
        String sql = "SELECT * FROM notifications WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapNotification(rs));
                }
                return Optional.empty();
            }
        } catch (SQLException ex) {
            throw new DaoException("NotificationDao.findById failed", ex);
        }
    }

    public List<Notification> findAll() {
        String sql = "SELECT * FROM notifications";
        List<Notification> notifications = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                notifications.add(mapNotification(rs));
            }
            return notifications;
        } catch (SQLException ex) {
            throw new DaoException("NotificationDao.findAll failed", ex);
        }
    }

    public Notification save(Notification notification) {
        if (notification == null) {
            throw new IllegalArgumentException("NotificationDao.save notification is null");
        }
        if (notification.getId() == null) {
            insertNotification(notification);
        } else {
            updateNotification(notification);
        }
        return notification;
    }

    public void deleteById(Long id) {
        String sql = "DELETE FROM notifications WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, id);
            stmt.executeUpdate();
        } catch (SQLException ex) {
            throw new DaoException("NotificationDao.deleteById failed", ex);
        }
    }

    private void insertNotification(Notification notification) {
        String sql = "INSERT INTO notifications (user_id, title, message, type, related_event_id, related_user_id, "
                + "is_read, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            LocalDateTime createdAt = notification.getCreatedAt() != null
                    ? notification.getCreatedAt()
                    : LocalDateTime.now();
            bindNotification(stmt, notification, createdAt, false);
            stmt.executeUpdate();
            try (ResultSet keys = stmt.getGeneratedKeys()) {
                if (keys.next()) {
                    notification.setId(keys.getLong(1));
                }
            }
            notification.setCreatedAt(createdAt);
        } catch (SQLException ex) {
            throw new DaoException("NotificationDao.insertNotification failed", ex);
        }
    }

    private void updateNotification(Notification notification) {
        String sql = "UPDATE notifications SET user_id = ?, title = ?, message = ?, type = ?, related_event_id = ?, "
                + "related_user_id = ?, is_read = ?, created_at = ? WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            bindNotification(stmt, notification, notification.getCreatedAt(), true);
            stmt.executeUpdate();
        } catch (SQLException ex) {
            throw new DaoException("NotificationDao.updateNotification failed", ex);
        }
    }

    private void bindNotification(PreparedStatement stmt, Notification notification, LocalDateTime createdAt,
                                  boolean includeId) throws SQLException {
        stmt.setObject(1, notification.getUserId());
        stmt.setString(2, notification.getTitle());
        stmt.setString(3, notification.getMessage());
        stmt.setString(4, notification.getType());
        stmt.setObject(5, notification.getRelatedEventId());
        stmt.setObject(6, notification.getRelatedUserId());
        stmt.setBoolean(7, notification.getIsRead());
        stmt.setObject(8, createdAt);
        if (includeId) {
            stmt.setLong(9, notification.getId());
        }
    }

    private Notification mapNotification(ResultSet rs) throws SQLException {
        Notification notification = new Notification();
        notification.setId(rs.getLong("id"));
        notification.setUserId((Long) rs.getObject("user_id"));
        notification.setTitle(rs.getString("title"));
        notification.setMessage(rs.getString("message"));
        notification.setType(rs.getString("type"));
        notification.setRelatedEventId((Long) rs.getObject("related_event_id"));
        notification.setRelatedUserId((Long) rs.getObject("related_user_id"));
        notification.setIsRead(rs.getBoolean("is_read"));
        notification.setCreatedAt(rs.getObject("created_at", LocalDateTime.class));
        return notification;
    }
}
