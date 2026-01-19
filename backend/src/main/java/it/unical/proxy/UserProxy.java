package it.unical.proxy;

import it.unical.dao.base.DaoException;
import it.unical.model.Event;
import it.unical.model.User;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

public class UserProxy extends User {
    private final DataSource dataSource;

    public UserProxy(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public Set<Event> getParticipatingEvents() {
        Set<Event> events = super.getParticipatingEvents();
        if (events == null || events.isEmpty()) {
            events = loadEvents("user_participations");
            super.setParticipatingEvents(events);
        }
        return events;
    }

    @Override
    public Set<Event> getSavedEvents() {
        Set<Event> events = super.getSavedEvents();
        if (events == null || events.isEmpty()) {
            events = loadEvents("user_saved");
            super.setSavedEvents(events);
        }
        return events;
    }

    @Override
    public Set<Event> getPendingEvents() {
        Set<Event> events = super.getPendingEvents();
        if (events == null || events.isEmpty()) {
            events = loadEvents("user_pending_participations");
            super.setPendingEvents(events);
        }
        return events;
    }

    @Override
    public Set<User> getFollowing() {
        Set<User> users = super.getFollowing();
        if (users == null || users.isEmpty()) {
            users = loadUsers("user_follows", "follower_id", "followed_id");
            super.setFollowing(users);
        }
        return users;
    }

    @Override
    public Set<User> getFollowers() {
        Set<User> users = super.getFollowers();
        if (users == null || users.isEmpty()) {
            users = loadUsers("user_follows", "followed_id", "follower_id");
            super.setFollowers(users);
        }
        return users;
    }

    @Override
    public Set<User> getFollowNotifications() {
        Set<User> users = super.getFollowNotifications();
        if (users == null || users.isEmpty()) {
            users = loadUsers("user_follow_notifications", "follower_id", "followed_id");
            super.setFollowNotifications(users);
        }
        return users;
    }

    @Override
    public int getFollowersCount() {
        return getFollowers().size();
    }

    @Override
    public int getFollowingCount() {
        return getFollowing().size();
    }

    private Set<Event> loadEvents(String joinTable) {
        Set<Event> events = new HashSet<>();
        if (dataSource == null || getId() == null) {
            return events;
        }
        String sql = "SELECT "
                + "e.id as e_id, e.title as e_title, e.description as e_description, e.n_partecipants as e_n_partecipants, "
                + "e.city as e_city, e.date as e_date, e.end_date as e_end_date, e.start_time as e_start_time, "
                + "e.end_time as e_end_time, e.created_at as e_created_at, e.latitude as e_latitude, "
                + "e.longitude as e_longitude, e.cost_per_person as e_cost_per_person, e.is_approved as e_is_approved, "
                + "e.creator_id as e_creator_id, "
                + "u.id as c_id, u.name as c_name, u.email as c_email, u.password_hash as c_password_hash, "
                + "u.birthdate as c_birthdate, u.profile_image as c_profile_image, "
                + "u.profile_image_data as c_profile_image_data, u.description as c_description, u.is_admin as c_is_admin "
                + "FROM \"event\" e "
                + "LEFT JOIN users u ON e.creator_id = u.id "
                + "JOIN " + joinTable + " j ON j.event_id = e.id "
                + "WHERE j.user_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, getId());
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    events.add(mapEvent(rs));
                }
            }
        } catch (SQLException ex) {
            throw new DaoException("UserProxy.loadEvents failed", ex);
        }
        return events;
    }

    private Set<User> loadUsers(String joinTable, String leftColumn, String rightColumn) {
        Set<User> users = new HashSet<>();
        if (dataSource == null || getId() == null) {
            return users;
        }
        String sql = "SELECT u.id, u.name, u.email, u.password_hash, u.birthdate, u.profile_image, "
                + "u.profile_image_data, u.description, u.is_admin FROM users u "
                + "JOIN " + joinTable + " j ON j." + rightColumn + " = u.id "
                + "WHERE j." + leftColumn + " = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, getId());
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    users.add(mapUser(rs));
                }
            }
        } catch (SQLException ex) {
            throw new DaoException("UserProxy.loadUsers failed", ex);
        }
        return users;
    }

    private Event mapEvent(ResultSet rs) throws SQLException {
        Event event = new EventProxy(dataSource);
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

        Long creatorId = (Long) rs.getObject("c_id");
        if (creatorId != null) {
            User creator = new UserProxy(dataSource);
            creator.setId(creatorId);
            creator.setName(rs.getString("c_name"));
            creator.setEmail(rs.getString("c_email"));
            creator.setPasswordHash(rs.getString("c_password_hash"));
            creator.setBirthdate(rs.getString("c_birthdate"));
            creator.setProfileImage(rs.getString("c_profile_image"));
            creator.setProfileImageData(rs.getBytes("c_profile_image_data"));
            creator.setDescription(rs.getString("c_description"));
            creator.setIsAdmin(rs.getBoolean("c_is_admin"));
            event.setCreator(creator);
        }

        return event;
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

    private LocalDate parseLocalDate(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return LocalDate.parse(value);
    }
}
