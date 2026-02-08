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
    // Proxy che carica in modo lazy partecipanti/salvati e creator al primo accesso.
    private transient javax.sql.DataSource dataSource;
    private Long creatorId;
    private boolean creatorLoaded;
    private boolean participantsLoaded;
    private boolean pendingParticipantsLoaded;
    private boolean usersWhoSavedLoaded;

    public EventProxy() {
    }

    public EventProxy(javax.sql.DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public User getCreator() {
        ensureCreatorLoaded();
        return super.getCreator();
    }

    @Override
    public void setCreator(User creator) {
        super.setCreator(creator);
        creatorId = creator != null ? creator.getId() : null;
        // Se abbiamo almeno il nome/email, consideriamo il creator caricato.
        creatorLoaded = creator == null
                || creator.getName() != null
                || creator.getEmail() != null
                || creator.getProfileImage() != null;
    }

    @Override
    public Long getCreatorId() {
        if (super.getCreator() != null && super.getCreator().getId() != null) {
            return super.getCreator().getId();
        }
        return creatorId;
    }

    public void setCreatorId(Long creatorId) {
        this.creatorId = creatorId;
        if (creatorId == null) {
            creatorLoaded = true;
        }
    }

    @Override
    public String getOrganizerName() {
        ensureCreatorLoaded();
        return super.getOrganizerName();
    }

    @Override
    public String getOrganizerImage() {
        ensureCreatorLoaded();
        return super.getOrganizerImage();
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

    private void ensureCreatorLoaded() {
        if (creatorLoaded) {
            return;
        }
        creatorLoaded = true;
        Long id = creatorId;
        if (id == null && super.getCreator() != null) {
            id = super.getCreator().getId();
        }
        if (dataSource == null || id == null) {
            return;
        }
        User creator = loadCreator(id);
        if (creator != null) {
            super.setCreator(creator);
            creatorId = id;
        }
    }

    private User loadCreator(Long id) {
        String sql = "SELECT id, name, email, password_hash, birthdate, profile_image, profile_image_data, "
                + "description, is_admin FROM users WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (!rs.next()) {
                    return null;
                }
                User creator = new UserProxy(dataSource);
                creator.setId(rs.getLong("id"));
                creator.setName(rs.getString("name"));
                creator.setEmail(rs.getString("email"));
                creator.setPasswordHash(rs.getString("password_hash"));
                creator.setBirthdate(rs.getString("birthdate"));
                creator.setProfileImage(rs.getString("profile_image"));
                creator.setProfileImageData(rs.getBytes("profile_image_data"));
                creator.setDescription(rs.getString("description"));
                creator.setIsAdmin(rs.getBoolean("is_admin"));
                return creator;
            }
        } catch (SQLException ex) {
            throw new DaoException("EventProxy.loadCreator failed", ex);
        }
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
