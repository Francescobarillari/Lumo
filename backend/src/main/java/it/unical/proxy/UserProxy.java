package it.unical.proxy;

import it.unical.dao.base.DaoException;
import it.unical.model.Event;
import it.unical.model.User;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;

public class UserProxy extends User {
    // Proxy che carica in modo lazy le relazioni dell'utente al primo accesso, mantenendo i set coerenti.
    private transient javax.sql.DataSource dataSource;
    private boolean participatingEventsLoaded;
    private boolean savedEventsLoaded;
    private boolean pendingEventsLoaded;
    private boolean followingLoaded;
    private boolean followersLoaded;
    private boolean followNotificationsLoaded;

    public UserProxy() {
    }

    public UserProxy(javax.sql.DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public Set<Event> getParticipatingEvents() {
        ensureParticipatingEventsLoaded();
        return super.getParticipatingEvents();
    }

    @Override
    public Set<Event> getSavedEvents() {
        ensureSavedEventsLoaded();
        return super.getSavedEvents();
    }

    @Override
    public Set<Event> getPendingEvents() {
        ensurePendingEventsLoaded();
        return super.getPendingEvents();
    }

    @Override
    public Set<User> getFollowing() {
        ensureFollowingLoaded();
        return super.getFollowing();
    }

    @Override
    public Set<User> getFollowers() {
        ensureFollowersLoaded();
        return super.getFollowers();
    }

    @Override
    public Set<User> getFollowNotifications() {
        ensureFollowNotificationsLoaded();
        return super.getFollowNotifications();
    }

    @Override
    public int getFollowersCount() {
        return getFollowers().size();
    }

    @Override
    public int getFollowingCount() {
        return getFollowing().size();
    }

    @Override
    public void setParticipatingEvents(Set<Event> participatingEvents) {
        participatingEventsLoaded = true;
        Set<Event> participating = sanitizeEvents(participatingEvents);
        super.setParticipatingEvents(participating);
        super.setPendingEvents(removeOverlaps(sanitizeEvents(super.getPendingEvents()), participating));
    }

    @Override
    public void setPendingEvents(Set<Event> pendingEvents) {
        pendingEventsLoaded = true;
        Set<Event> pending = sanitizeEvents(pendingEvents);
        Set<Event> participating = sanitizeEvents(super.getParticipatingEvents());
        super.setPendingEvents(removeOverlaps(pending, participating));
    }

    @Override
    public void setSavedEvents(Set<Event> savedEvents) {
        savedEventsLoaded = true;
        super.setSavedEvents(sanitizeEvents(savedEvents));
    }

    @Override
    public void setFollowing(Set<User> following) {
        followingLoaded = true;
        Set<User> sanitizedFollowing = sanitizeUsers(following);
        super.setFollowing(sanitizedFollowing);
        if (followNotificationsLoaded) {
            super.setFollowNotifications(keepSubset(sanitizeUsers(super.getFollowNotifications()), sanitizedFollowing));
        }
    }

    @Override
    public void setFollowers(Set<User> followers) {
        followersLoaded = true;
        super.setFollowers(sanitizeUsers(followers));
    }

    @Override
    public void setFollowNotifications(Set<User> followNotifications) {
        followNotificationsLoaded = true;
        Set<User> sanitized = sanitizeUsers(followNotifications);
        if (followingLoaded) {
            Set<User> following = sanitizeUsers(super.getFollowing());
            super.setFollowNotifications(keepSubset(sanitized, following));
        } else {
            super.setFollowNotifications(sanitized);
        }
    }

    private void ensureParticipatingEventsLoaded() {
        if (participatingEventsLoaded) {
            return;
        }
        participatingEventsLoaded = true;
        if (!canLazyLoad()) {
            if (super.getParticipatingEvents() == null) {
                super.setParticipatingEvents(new LinkedHashSet<>());
            }
            return;
        }
        setParticipatingEvents(loadUserEvents(getId(), "user_participations"));
    }

    private void ensureSavedEventsLoaded() {
        if (savedEventsLoaded) {
            return;
        }
        savedEventsLoaded = true;
        if (!canLazyLoad()) {
            if (super.getSavedEvents() == null) {
                super.setSavedEvents(new LinkedHashSet<>());
            }
            return;
        }
        setSavedEvents(loadUserEvents(getId(), "user_saved"));
    }

    private void ensurePendingEventsLoaded() {
        if (pendingEventsLoaded) {
            return;
        }
        pendingEventsLoaded = true;
        if (!canLazyLoad()) {
            if (super.getPendingEvents() == null) {
                super.setPendingEvents(new LinkedHashSet<>());
            }
            return;
        }
        setPendingEvents(loadUserEvents(getId(), "user_pending_participations"));
    }

    private void ensureFollowingLoaded() {
        if (followingLoaded) {
            return;
        }
        followingLoaded = true;
        if (!canLazyLoad()) {
            if (super.getFollowing() == null) {
                super.setFollowing(new LinkedHashSet<>());
            }
            return;
        }
        setFollowing(loadUserUsers(getId(), "user_follows", "follower_id", "followed_id"));
    }

    private void ensureFollowersLoaded() {
        if (followersLoaded) {
            return;
        }
        followersLoaded = true;
        if (!canLazyLoad()) {
            if (super.getFollowers() == null) {
                super.setFollowers(new LinkedHashSet<>());
            }
            return;
        }
        setFollowers(loadUserUsers(getId(), "user_follows", "followed_id", "follower_id"));
    }

    private void ensureFollowNotificationsLoaded() {
        if (followNotificationsLoaded) {
            return;
        }
        followNotificationsLoaded = true;
        if (!canLazyLoad()) {
            if (super.getFollowNotifications() == null) {
                super.setFollowNotifications(new LinkedHashSet<>());
            }
            return;
        }
        setFollowNotifications(loadUserUsers(getId(), "user_follow_notifications", "follower_id", "followed_id"));
    }

    private boolean canLazyLoad() {
        return dataSource != null && getId() != null;
    }

    private Set<Event> loadUserEvents(Long userId, String joinTable) {
        Set<Event> events = new LinkedHashSet<>();
        String sql = "SELECT "
                + "e.id as e_id, e.title as e_title, e.description as e_description, e.n_partecipants as e_n_partecipants, "
                + "e.city as e_city, e.date as e_date, e.end_date as e_end_date, e.start_time as e_start_time, "
                + "e.end_time as e_end_time, e.created_at as e_created_at, e.latitude as e_latitude, "
                + "e.longitude as e_longitude, e.cost_per_person as e_cost_per_person, e.is_approved as e_is_approved, "
                + "e.creator_id as e_creator_id "
                + "FROM \"event\" e "
                + "JOIN " + joinTable + " j ON j.event_id = e.id "
                + "WHERE j.user_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, userId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    events.add(mapEventShallow(rs));
                }
            }
            return events;
        } catch (SQLException ex) {
            throw new DaoException("UserProxy.loadUserEvents failed", ex);
        }
    }

    private Set<User> loadUserUsers(Long userId, String joinTable, String leftColumn, String rightColumn) {
        Set<User> users = new LinkedHashSet<>();
        String sql = "SELECT u.id, u.name, u.email, u.password_hash, u.birthdate, u.profile_image, "
                + "u.profile_image_data, u.description, u.is_admin FROM users u "
                + "JOIN " + joinTable + " j ON j." + rightColumn + " = u.id "
                + "WHERE j." + leftColumn + " = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, userId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    users.add(mapUserBase(rs));
                }
            }
            return users;
        } catch (SQLException ex) {
            throw new DaoException("UserProxy.loadUserUsers failed", ex);
        }
    }

    private Event mapEventShallow(ResultSet rs) throws SQLException {
        EventProxy event = new EventProxy(dataSource);
        event.setId(rs.getLong("e_id"));
        event.setTitle(rs.getString("e_title"));
        event.setDescription(rs.getString("e_description"));
        event.setnPartecipants(rs.getInt("e_n_partecipants"));
        event.setCity(rs.getString("e_city"));
        event.setDate(parseLocalDate(rs.getString("e_date")));
        event.setEndDate(parseLocalDate(rs.getString("e_end_date")));
        event.setStartTime(rs.getObject("e_start_time", LocalTime.class));
        event.setEndTime(rs.getObject("e_end_time", LocalTime.class));
        event.setCreatedAt(rs.getObject("e_created_at", LocalDateTime.class));
        event.setLatitude((Double) rs.getObject("e_latitude"));
        event.setLongitude((Double) rs.getObject("e_longitude"));
        event.setCostPerPerson((Double) rs.getObject("e_cost_per_person"));
        event.setIsApproved(rs.getBoolean("e_is_approved"));

        Long creatorId = (Long) rs.getObject("e_creator_id");
        if (creatorId != null) {
            event.setCreatorId(creatorId);
        }
        return event;
    }

    private User mapUserBase(ResultSet rs) throws SQLException {
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

    private LocalDate parseLocalDate(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return LocalDate.parse(value);
    }

    private Set<Event> sanitizeEvents(Set<Event> events) {
        Map<Long, Event> byId = new LinkedHashMap<>();
        if (events == null) {
            return new LinkedHashSet<>();
        }
        for (Event event : events) {
            if (event == null || event.getId() == null) {
                continue;
            }
            byId.putIfAbsent(event.getId(), event);
        }
        return new LinkedHashSet<>(byId.values());
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
            if (getId() != null && getId().equals(user.getId())) {
                continue;
            }
            byId.putIfAbsent(user.getId(), user);
        }
        return new LinkedHashSet<>(byId.values());
    }

    private Set<Event> removeOverlaps(Set<Event> source, Set<Event> forbidden) {
        Set<Event> result = new LinkedHashSet<>(source);
        result.removeIf(event -> forbidden.stream().anyMatch(e -> e.getId().equals(event.getId())));
        return result;
    }

    private Set<User> keepSubset(Set<User> source, Set<User> allowed) {
        Set<User> result = new LinkedHashSet<>(source);
        result.removeIf(user -> allowed.stream().noneMatch(a -> a.getId().equals(user.getId())));
        return result;
    }
}
