package it.unical.proxy;

import it.unical.dao.base.DaoException;
import it.unical.model.Event;
import it.unical.model.User;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashSet;
import java.util.Set;

public class EventProxy extends Event {
    private final DataSource dataSource;

    public EventProxy(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public Set<User> getParticipants() {
        Set<User> participants = super.getParticipants();
        if (participants == null || participants.isEmpty()) {
            participants = loadUsers("user_participations");
            super.setParticipants(participants);
        }
        return participants;
    }

    @Override
    public Set<User> getPendingParticipants() {
        Set<User> pending = super.getPendingParticipants();
        if (pending == null || pending.isEmpty()) {
            pending = loadUsers("user_pending_participations");
            super.setPendingParticipants(pending);
        }
        return pending;
    }

    @Override
    public Set<User> getUsersWhoSaved() {
        Set<User> saved = super.getUsersWhoSaved();
        if (saved == null || saved.isEmpty()) {
            saved = loadUsers("user_saved");
            super.setUsersWhoSaved(saved);
        }
        return saved;
    }

    private Set<User> loadUsers(String joinTable) {
        Set<User> users = new HashSet<>();
        if (dataSource == null || getId() == null) {
            return users;
        }
        String sql = "SELECT u.id, u.name, u.email, u.password_hash, u.birthdate, u.profile_image, "
                + "u.profile_image_data, u.description, u.is_admin FROM users u "
                + "JOIN " + joinTable + " j ON j.user_id = u.id WHERE j.event_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, getId());
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    users.add(mapUser(rs));
                }
            }
        } catch (SQLException ex) {
            throw new DaoException("EventProxy.loadUsers failed", ex);
        }
        return users;
    }

    private User mapUser(ResultSet rs) throws SQLException {
        User user = new UserProxy(dataSource);
        user.setId(rs.getLong("id"));
        user.setName(rs.getString("name"));
        user.setEmail(rs.getString("email"));
        user.setPasswordHash(rs.getString("password_hash"));
        user.setBirthdate(rs.getString("birthdate"));
        user.setProfileImage(rs.getString("profile_image"));
        user.setProfileImageData(rs.getBytes("profile_image_data"));
        user.setDescription(rs.getString("description"));
        user.setIsAdmin(rs.getBoolean("is_admin"));
        return user;
    }
}
