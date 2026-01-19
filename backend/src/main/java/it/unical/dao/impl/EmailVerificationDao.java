package it.unical.dao.impl;

import it.unical.dao.base.DaoException;

import it.unical.model.EmailVerification;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class EmailVerificationDao {
    private final DataSource dataSource;

    public EmailVerificationDao(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public Optional<EmailVerification> findByToken(String token) {
        String sql = "SELECT * FROM email_verification WHERE token = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, token);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapVerification(rs));
                }
                return Optional.empty();
            }
        } catch (SQLException ex) {
            throw new DaoException("EmailVerificationDao.findByToken failed", ex);
        }
    }

    public Optional<EmailVerification> findByEmailAndUsedFalse(String email) {
        String sql = "SELECT * FROM email_verification WHERE email = ? AND used = false";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, email);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapVerification(rs));
                }
                return Optional.empty();
            }
        } catch (SQLException ex) {
            throw new DaoException("EmailVerificationDao.findByEmailAndUsedFalse failed", ex);
        }
    }

    public Optional<EmailVerification> findById(Long id) {
        String sql = "SELECT * FROM email_verification WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapVerification(rs));
                }
                return Optional.empty();
            }
        } catch (SQLException ex) {
            throw new DaoException("EmailVerificationDao.findById failed", ex);
        }
    }

    public List<EmailVerification> findAll() {
        String sql = "SELECT * FROM email_verification";
        List<EmailVerification> results = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                results.add(mapVerification(rs));
            }
            return results;
        } catch (SQLException ex) {
            throw new DaoException("EmailVerificationDao.findAll failed", ex);
        }
    }

    public EmailVerification save(EmailVerification verification) {
        if (verification == null) {
            throw new IllegalArgumentException("EmailVerificationDao.save verification is null");
        }
        if (verification.getId() == null) {
            insertVerification(verification);
        } else {
            updateVerification(verification);
        }
        return verification;
    }

    public void delete(EmailVerification verification) {
        if (verification == null || verification.getId() == null) {
            return;
        }
        deleteById(verification.getId());
    }

    public void deleteById(Long id) {
        String sql = "DELETE FROM email_verification WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, id);
            stmt.executeUpdate();
        } catch (SQLException ex) {
            throw new DaoException("EmailVerificationDao.deleteById failed", ex);
        }
    }

    private void insertVerification(EmailVerification verification) {
        String sql = "INSERT INTO email_verification (email, name, birthdate, password_hash, token, expires_at, used) "
                + "VALUES (?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            bindVerification(stmt, verification, false);
            stmt.executeUpdate();
            try (ResultSet keys = stmt.getGeneratedKeys()) {
                if (keys.next()) {
                    verification.setId(keys.getLong(1));
                }
            }
        } catch (SQLException ex) {
            throw new DaoException("EmailVerificationDao.insertVerification failed", ex);
        }
    }

    private void updateVerification(EmailVerification verification) {
        String sql = "UPDATE email_verification SET email = ?, name = ?, birthdate = ?, password_hash = ?, "
                + "token = ?, expires_at = ?, used = ? WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            bindVerification(stmt, verification, true);
            stmt.executeUpdate();
        } catch (SQLException ex) {
            throw new DaoException("EmailVerificationDao.updateVerification failed", ex);
        }
    }

    private void bindVerification(PreparedStatement stmt, EmailVerification verification, boolean includeId)
            throws SQLException {
        stmt.setString(1, verification.getEmail());
        stmt.setString(2, verification.getName());
        stmt.setString(3, verification.getBirthdate());
        stmt.setString(4, verification.getPasswordHash());
        stmt.setString(5, verification.getToken());
        stmt.setObject(6, verification.getExpiresAt());
        stmt.setBoolean(7, verification.isUsed());
        if (includeId) {
            stmt.setLong(8, verification.getId());
        }
    }

    private EmailVerification mapVerification(ResultSet rs) throws SQLException {
        EmailVerification verification = new EmailVerification();
        verification.setId(rs.getLong("id"));
        verification.setEmail(rs.getString("email"));
        verification.setName(rs.getString("name"));
        verification.setBirthdate(rs.getString("birthdate"));
        verification.setPasswordHash(rs.getString("password_hash"));
        verification.setToken(rs.getString("token"));
        verification.setExpiresAt(rs.getObject("expires_at", LocalDateTime.class));
        verification.setUsed(rs.getBoolean("used"));
        return verification;
    }
}
