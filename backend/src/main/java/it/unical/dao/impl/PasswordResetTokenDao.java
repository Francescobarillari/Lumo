package it.unical.dao.impl;

import it.unical.dao.base.DaoException;

import it.unical.model.PasswordResetToken;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class PasswordResetTokenDao {
    private final DataSource dataSource;

    public PasswordResetTokenDao(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public Optional<PasswordResetToken> findByToken(String token) {
        String sql = "SELECT * FROM password_reset_tokens WHERE token = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, token);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapToken(rs));
                }
                return Optional.empty();
            }
        } catch (SQLException ex) {
            throw new DaoException("PasswordResetTokenDao.findByToken failed", ex);
        }
    }

    public Optional<PasswordResetToken> findByEmailAndUsedFalse(String email) {
        String sql = "SELECT * FROM password_reset_tokens WHERE email = ? AND used = false";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, email);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapToken(rs));
                }
                return Optional.empty();
            }
        } catch (SQLException ex) {
            throw new DaoException("PasswordResetTokenDao.findByEmailAndUsedFalse failed", ex);
        }
    }

    public Optional<PasswordResetToken> findById(Long id) {
        String sql = "SELECT * FROM password_reset_tokens WHERE id = ?";
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
            throw new DaoException("PasswordResetTokenDao.findById failed", ex);
        }
    }

    public List<PasswordResetToken> findAll() {
        String sql = "SELECT * FROM password_reset_tokens";
        List<PasswordResetToken> tokens = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                tokens.add(mapToken(rs));
            }
            return tokens;
        } catch (SQLException ex) {
            throw new DaoException("PasswordResetTokenDao.findAll failed", ex);
        }
    }

    public PasswordResetToken save(PasswordResetToken token) {
        if (token == null) {
            throw new IllegalArgumentException("PasswordResetTokenDao.save token is null");
        }
        if (token.getId() == null) {
            insertToken(token);
        } else {
            updateToken(token);
        }
        return token;
    }

    public void delete(PasswordResetToken token) {
        if (token == null || token.getId() == null) {
            return;
        }
        deleteById(token.getId());
    }

    public void deleteById(Long id) {
        String sql = "DELETE FROM password_reset_tokens WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, id);
            stmt.executeUpdate();
        } catch (SQLException ex) {
            throw new DaoException("PasswordResetTokenDao.deleteById failed", ex);
        }
    }

    private void insertToken(PasswordResetToken token) {
        String sql = "INSERT INTO password_reset_tokens (email, token, expires_at, used) VALUES (?, ?, ?, ?)";
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
            throw new DaoException("PasswordResetTokenDao.insertToken failed", ex);
        }
    }

    private void updateToken(PasswordResetToken token) {
        String sql = "UPDATE password_reset_tokens SET email = ?, token = ?, expires_at = ?, used = ? WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            bindToken(stmt, token, true);
            stmt.executeUpdate();
        } catch (SQLException ex) {
            throw new DaoException("PasswordResetTokenDao.updateToken failed", ex);
        }
    }

    private void bindToken(PreparedStatement stmt, PasswordResetToken token, boolean includeId) throws SQLException {
        stmt.setString(1, token.getEmail());
        stmt.setString(2, token.getToken());
        stmt.setObject(3, token.getExpiresAt());
        stmt.setBoolean(4, token.isUsed());
        if (includeId) {
            stmt.setLong(5, token.getId());
        }
    }

    private PasswordResetToken mapToken(ResultSet rs) throws SQLException {
        PasswordResetToken token = new PasswordResetToken();
        token.setId(rs.getLong("id"));
        token.setEmail(rs.getString("email"));
        token.setToken(rs.getString("token"));
        token.setExpiresAt(rs.getObject("expires_at", LocalDateTime.class));
        token.setUsed(rs.getBoolean("used"));
        return token;
    }
}
