package it.unical.repository;

import it.unical.model.ChatMute;
import it.unical.model.EventChat;
import it.unical.model.User;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class ChatMuteRepository {
    private final DataSource dataSource;

    public ChatMuteRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public Optional<ChatMute> findByChat_IdAndUser_Id(Long chatId, Long userId) {
        String sql = "SELECT m.id, m.chat_id, m.user_id, m.muted_by, m.reason, m.created_at, "
                + "u.name as user_name, mb.name as muted_by_name "
                + "FROM chat_mute m "
                + "LEFT JOIN users u ON m.user_id = u.id "
                + "LEFT JOIN users mb ON m.muted_by = mb.id "
                + "WHERE m.chat_id = ? AND m.user_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, chatId);
            stmt.setLong(2, userId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapMute(rs));
                }
                return Optional.empty();
            }
        } catch (SQLException ex) {
            throw new DaoException("ChatMuteRepository.findByChat_IdAndUser_Id failed", ex);
        }
    }

    public List<ChatMute> findByChat_Id(Long chatId) {
        String sql = "SELECT m.id, m.chat_id, m.user_id, m.muted_by, m.reason, m.created_at, "
                + "u.name as user_name, mb.name as muted_by_name "
                + "FROM chat_mute m "
                + "LEFT JOIN users u ON m.user_id = u.id "
                + "LEFT JOIN users mb ON m.muted_by = mb.id "
                + "WHERE m.chat_id = ?";
        List<ChatMute> mutes = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, chatId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    mutes.add(mapMute(rs));
                }
            }
            return mutes;
        } catch (SQLException ex) {
            throw new DaoException("ChatMuteRepository.findByChat_Id failed", ex);
        }
    }

    public ChatMute save(ChatMute mute) {
        if (mute == null) {
            throw new IllegalArgumentException("ChatMuteRepository.save mute is null");
        }
        if (mute.getId() == null) {
            insertMute(mute);
        } else {
            updateMute(mute);
        }
        return mute;
    }

    public void delete(ChatMute mute) {
        if (mute == null || mute.getId() == null) {
            return;
        }
        deleteById(mute.getId());
    }

    public void deleteById(Long id) {
        String sql = "DELETE FROM chat_mute WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, id);
            stmt.executeUpdate();
        } catch (SQLException ex) {
            throw new DaoException("ChatMuteRepository.deleteById failed", ex);
        }
    }

    private void insertMute(ChatMute mute) {
        String sql = "INSERT INTO chat_mute (chat_id, user_id, muted_by, reason, created_at) VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            bindMute(stmt, mute, false);
            stmt.executeUpdate();
            try (ResultSet keys = stmt.getGeneratedKeys()) {
                if (keys.next()) {
                    mute.setId(keys.getLong(1));
                }
            }
        } catch (SQLException ex) {
            throw new DaoException("ChatMuteRepository.insertMute failed", ex);
        }
    }

    private void updateMute(ChatMute mute) {
        String sql = "UPDATE chat_mute SET chat_id = ?, user_id = ?, muted_by = ?, reason = ?, created_at = ? "
                + "WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            bindMute(stmt, mute, true);
            stmt.executeUpdate();
        } catch (SQLException ex) {
            throw new DaoException("ChatMuteRepository.updateMute failed", ex);
        }
    }

    private void bindMute(PreparedStatement stmt, ChatMute mute, boolean includeId) throws SQLException {
        stmt.setObject(1, mute.getChat() != null ? mute.getChat().getId() : null);
        stmt.setObject(2, mute.getUser() != null ? mute.getUser().getId() : null);
        stmt.setObject(3, mute.getMutedBy() != null ? mute.getMutedBy().getId() : null);
        stmt.setString(4, mute.getReason());
        stmt.setObject(5, mute.getCreatedAt());
        if (includeId) {
            stmt.setLong(6, mute.getId());
        }
    }

    private ChatMute mapMute(ResultSet rs) throws SQLException {
        ChatMute mute = new ChatMute();
        mute.setId(rs.getLong("id"));

        Long chatId = (Long) rs.getObject("chat_id");
        if (chatId != null) {
            EventChat chat = new EventChat();
            chat.setId(chatId);
            mute.setChat(chat);
        }

        Long userId = (Long) rs.getObject("user_id");
        if (userId != null) {
            User user = new User();
            user.setId(userId);
            user.setName(rs.getString("user_name"));
            mute.setUser(user);
        }

        Long mutedById = (Long) rs.getObject("muted_by");
        if (mutedById != null) {
            User mutedBy = new User();
            mutedBy.setId(mutedById);
            mutedBy.setName(rs.getString("muted_by_name"));
            mute.setMutedBy(mutedBy);
        }

        mute.setReason(rs.getString("reason"));
        mute.setCreatedAt(rs.getObject("created_at", LocalDateTime.class));
        return mute;
    }
}
