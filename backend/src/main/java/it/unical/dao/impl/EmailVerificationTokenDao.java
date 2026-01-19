package it.unical.dao.impl;

import it.unical.dao.base.DaoException;

import it.unical.model.EmailVerificationToken;
import it.unical.model.User;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class EmailVerificationTokenDao {
    private final DataSource dataSource;

    public EmailVerificationTokenDao(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public EmailVerificationToken findByToken(String token) {
        String sql = "SELECT t.id, t.token, t.created_at, t.expires_at, t.user_id, "
                + "u.name, u.email, u.password_hash, u.birthdate, u.profile_image, u.profile_image_data, "
                + "u.description, u.is_admin "
                + "FROM email_verification_token t LEFT JOIN users u ON t.user_id = u.id WHERE t.token = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, token);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapToken(rs);
                }
                return null;
            }
        } catch (SQLException ex) {
            throw new DaoException("EmailVerificationTokenDao.findByToken failed", ex);
        }
    }

    public Optional<EmailVerificationToken> findById(Long id) {
        String sql = "SELECT t.id, t.token, t.created_at, t.expires_at, t.user_id, "
                + "u.name, u.email, u.password_hash, u.birthdate, u.profile_image, u.profile_image_data, "
                + "u.description, u.is_admin "
                + "FROM email_verification_token t LEFT JOIN users u ON t.user_id = u.id WHERE t.id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapToken(rs));
                }
                return Optional.empty();
            }
        } catch (SQLException ex) {
            throw new DaoException("EmailVerificationTokenDao.findById failed", ex);
        }
    }

    public List<EmailVerificationToken> findAll() {
        String sql = "SELECT t.id, t.token, t.created_at, t.expires_at, t.user_id, "
                + "u.name, u.email, u.password_hash, u.birthdate, u.profile_image, u.profile_image_data, "
                + "u.description, u.is_admin "
                + "FROM email_verification_token t LEFT JOIN users u ON t.user_id = u.id";
        List<EmailVerificationToken> tokens = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                tokens.add(mapToken(rs));
            }
            return tokens;
        } catch (SQLException ex) {
            throw new DaoException("EmailVerificationTokenDao.findAll failed", ex);
        }
    }

    public EmailVerificationToken save(EmailVerificationToken token) {
        if (token == null) {
            throw new IllegalArgumentException("EmailVerificationTokenDao.save token is null");
        }
        if (token.getId() == null) {
            insertToken(token);
        } else {
            updateToken(token);
        }
        return token;
    }

    public void deleteById(Long id) {
        String sql = "DELETE FROM email_verification_token WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, id);
            stmt.executeUpdate();
        } catch (SQLException ex) {
            throw new DaoException("EmailVerificationTokenDao.deleteById failed", ex);
        }
    }

    private void insertToken(EmailVerificationToken token) {
        String sql = "INSERT INTO email_verification_token (token, created_at, expires_at, user_id) VALUES (?, ?, ?, ?)";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            bindToken(stmt, token, false);
            stmt.executeUpdate();
            try (ResultSet keys = stmt.getGeneratedKeys()) {
                if (keys.next()) {
                    token.setId(keys.getLong(1));
                }
            }
        } catch (SQLException ex) {
            throw new DaoException("EmailVerificationTokenDao.insertToken failed", ex);
        }
    }

    private void updateToken(EmailVerificationToken token) {
        String sql = "UPDATE email_verification_token SET token = ?, created_at = ?, expires_at = ?, user_id = ? "
                + "WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            bindToken(stmt, token, true);
            stmt.executeUpdate();
        } catch (SQLException ex) {
            throw new DaoException("EmailVerificationTokenDao.updateToken failed", ex);
        }
    }

    private void bindToken(PreparedStatement stmt, EmailVerificationToken token, boolean includeId) throws SQLException {
        stmt.setString(1, token.getToken());
        stmt.setObject(2, token.getCreatedAt());
        stmt.setObject(3, token.getExpiresAt());
        stmt.setObject(4, token.getUser() != null ? token.getUser().getId() : null);
        if (includeId) {
            stmt.setLong(5, token.getId());
        }
    }

    private EmailVerificationToken mapToken(ResultSet rs) throws SQLException {
        EmailVerificationToken token = new EmailVerificationToken();
        token.setId(rs.getLong("id"));
        token.setToken(rs.getString("token"));
        token.setCreatedAt(rs.getObject("created_at", LocalDateTime.class));
        token.setExpiresAt(rs.getObject("expires_at", LocalDateTime.class));

        Long userId = (Long) rs.getObject("user_id");
        if (userId != null) {
            User user = new User();
            user.setId(userId);
            user.setName(rs.getString("name"));
            user.setEmail(rs.getString("email"));
            user.setPasswordHash(rs.getString("password_hash"));
            user.setBirthdate(rs.getString("birthdate"));
            user.setProfileImage(rs.getString("profile_image"));
            user.setProfileImageData(rs.getBytes("profile_image_data"));
            user.setDescription(rs.getString("description"));
            user.setIsAdmin(rs.getBoolean("is_admin"));
            token.setUser(user);
        }
        return token;
    }
}
