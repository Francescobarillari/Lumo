package it.unical.proxy;

import it.unical.dao.base.DaoException;
import it.unical.model.Event;
import it.unical.model.User;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;

public class EventProxy extends Event {
    // Proxy che carica in modo lazy partecipanti e salvati al primo accesso, mantenendo i set coerenti.
    private transient javax.sql.DataSource dataSource;
    private boolean participantsLoaded;
    private boolean pendingParticipantsLoaded;
    private boolean usersWhoSavedLoaded;

    public EventProxy() {
    }

    public EventProxy(javax.sql.DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public Set<User> getParticipants() {
        ensureParticipantsLoaded();
        return super.getParticipants();
    }

    @Override
    public Set<User> getPendingParticipants() {
        ensurePendingParticipantsLoaded();
        return super.getPendingParticipants();
    }

    @Override
    public Set<User> getUsersWhoSaved() {
        ensureUsersWhoSavedLoaded();
        return super.getUsersWhoSaved();
    }

    @Override
    public void setParticipants(Set<User> participants) {
        participantsLoaded = true;
        Set<User> accepted = sanitizeUsers(participants);
        super.setParticipants(accepted);
        super.setPendingParticipants(removeOverlaps(sanitizeUsers(super.getPendingParticipants()), accepted));
    }

    @Override
    public void setPendingParticipants(Set<User> pendingParticipants) {
        pendingParticipantsLoaded = true;
        Set<User> pending = sanitizeUsers(pendingParticipants);
        Set<User> accepted = sanitizeUsers(super.getParticipants());
        super.setPendingParticipants(removeOverlaps(pending, accepted));
    }

    @Override
    public void setUsersWhoSaved(Set<User> usersWhoSaved) {
        usersWhoSavedLoaded = true;
        super.setUsersWhoSaved(sanitizeUsers(usersWhoSaved));
    }

    private void ensureParticipantsLoaded() {
        if (participantsLoaded) {
            return;
        }
        participantsLoaded = true;
        if (!canLazyLoad()) {
            if (super.getParticipants() == null) {
                super.setParticipants(new LinkedHashSet<>());
            }
            return;
        }
        setParticipants(loadEventUsers(getId(), "user_participations"));
    }

    private void ensurePendingParticipantsLoaded() {
        if (pendingParticipantsLoaded) {
            return;
        }
        pendingParticipantsLoaded = true;
        if (!canLazyLoad()) {
            if (super.getPendingParticipants() == null) {
                super.setPendingParticipants(new LinkedHashSet<>());
            }
            return;
        }
        setPendingParticipants(loadEventUsers(getId(), "user_pending_participations"));
    }

    private void ensureUsersWhoSavedLoaded() {
        if (usersWhoSavedLoaded) {
            return;
        }
        usersWhoSavedLoaded = true;
        if (!canLazyLoad()) {
            if (super.getUsersWhoSaved() == null) {
                super.setUsersWhoSaved(new LinkedHashSet<>());
            }
            return;
        }
        setUsersWhoSaved(loadEventUsers(getId(), "user_saved"));
    }

    private boolean canLazyLoad() {
        return dataSource != null && getId() != null;
    }

    private Set<User> loadEventUsers(Long eventId, String joinTable) {
        Set<User> users = new LinkedHashSet<>();
        String sql = "SELECT u.id, u.name, u.email, u.password_hash, u.birthdate, u.profile_image, "
                + "u.profile_image_data, u.description, u.is_admin FROM users u "
                + "JOIN " + joinTable + " j ON j.user_id = u.id WHERE j.event_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, eventId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    users.add(mapUserShallow(rs));
                }
            }
            return users;
        } catch (SQLException ex) {
            throw new DaoException("EventProxy.loadEventUsers failed", ex);
        }
    }

    private User mapUserShallow(ResultSet rs) throws SQLException {
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

    private Set<User> sanitizeUsers(Set<User> users) {
        Map<Long, User> byId = new LinkedHashMap<>();
        if (users == null) {
            return new LinkedHashSet<>();
        }
        for (User user : users) {
            if (user == null || user.getId() == null) {
                continue;
            }
            byId.putIfAbsent(user.getId(), user);
        }
        return new LinkedHashSet<>(byId.values());
    }

    private Set<User> removeOverlaps(Set<User> source, Set<User> forbidden) {
        Set<User> result = new LinkedHashSet<>(source);
        result.removeIf(user -> forbidden.stream().anyMatch(f -> f.getId().equals(user.getId())));
        return result;
    }
}
