package it.unical.dao.impl;

import it.unical.dao.base.DaoException;

import it.unical.model.Event;
import it.unical.model.User;
import it.unical.proxy.EventProxy;
import it.unical.proxy.UserProxy;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.time.LocalDate;
import java.util.*;

@Repository
public class UserDao {
    private final DataSource dataSource;

    public UserDao(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public boolean existsByEmail(String email) {
        String sql = "SELECT 1 FROM users WHERE email = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, email);
            try (ResultSet rs = stmt.executeQuery()) {
                return rs.next();
            }
        } catch (SQLException ex) {
            throw new DaoException("UserDao.existsByEmail failed", ex);
        }
    }

    public Optional<User> findByEmail(String email) {
        String sql = "SELECT id, name, email, password_hash, birthdate, profile_image, profile_image_data, "
                + "description, is_admin FROM users WHERE email = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, email);
            try (ResultSet rs = stmt.executeQuery()) {
                if (!rs.next()) {
                    return Optional.empty();
                }
                User user = mapUserBase(rs, "");
                hydrateUserRelations(user);
                return Optional.of(user);
            }
        } catch (SQLException ex) {
            throw new DaoException("UserDao.findByEmail failed", ex);
        }
    }

    public List<User> findByNameContainingIgnoreCase(String name) {
        String sql = "SELECT id, name, email, password_hash, birthdate, profile_image, profile_image_data, "
                + "description, is_admin FROM users WHERE LOWER(name) LIKE LOWER(?)";
        List<User> users = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, "%" + name + "%");
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    User user = mapUserBase(rs, "");
                    hydrateUserRelations(user);
                    users.add(user);
                }
            }
            return users;
        } catch (SQLException ex) {
            throw new DaoException("UserDao.findByNameContainingIgnoreCase failed", ex);
        }
    }

    public Optional<User> findById(Long id) {
        String sql = "SELECT id, name, email, password_hash, birthdate, profile_image, profile_image_data, "
                + "description, is_admin FROM users WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (!rs.next()) {
                    return Optional.empty();
                }
                User user = mapUserBase(rs, "");
                hydrateUserRelations(user);
                return Optional.of(user);
            }
        } catch (SQLException ex) {
            throw new DaoException("UserDao.findById failed", ex);
        }
    }

    public List<User> findAll() {
        String sql = "SELECT id, name, email, password_hash, birthdate, profile_image, profile_image_data, "
                + "description, is_admin FROM users";
        List<User> users = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                User user = mapUserBase(rs, "");
                hydrateUserRelations(user);
                users.add(user);
            }
            return users;
        } catch (SQLException ex) {
            throw new DaoException("UserDao.findAll failed", ex);
        }
    }

    public User save(User user) {
        if (user == null) {
            throw new IllegalArgumentException("UserDao.save user is null");
        }

        normalizeRelations(user);

        try (Connection conn = dataSource.getConnection()) {
            conn.setAutoCommit(false);
            try {
                if (user.getId() == null) {
                    insertUser(conn, user);
                } else {
                    updateUser(conn, user);
                }

                if (user.getId() != null) {
                    syncUserRelations(conn, user);
                }

                conn.commit();
                return user;
            } catch (SQLException ex) {
                conn.rollback();
                throw new DaoException("UserDao.save failed", ex);
            } finally {
                conn.setAutoCommit(true);
            }
        } catch (SQLException ex) {
            throw new DaoException("UserDao.save failed", ex);
        }
    }

    public void deleteById(Long id) {
        try (Connection conn = dataSource.getConnection()) {
            conn.setAutoCommit(false);
            try {
                deleteUserRelations(conn, id);
                try (PreparedStatement stmt = conn.prepareStatement("DELETE FROM users WHERE id = ?")) {
                    stmt.setLong(1, id);
                    stmt.executeUpdate();
                }
                conn.commit();
            } catch (SQLException ex) {
                conn.rollback();
                throw new DaoException("UserDao.deleteById failed", ex);
            } finally {
                conn.setAutoCommit(true);
            }
        } catch (SQLException ex) {
            throw new DaoException("UserDao.deleteById failed", ex);
        }
    }

    private void deleteUserRelations(Connection conn, Long userId) throws SQLException {
        deleteByUser(conn, "user_participations", "user_id", userId);
        deleteByUser(conn, "user_saved", "user_id", userId);
        deleteByUser(conn, "user_pending_participations", "user_id", userId);
        deleteByUser(conn, "notifications", "user_id", userId);
        deleteByUser(conn, "user_follows", "follower_id", userId);
        deleteByUser(conn, "user_follows", "followed_id", userId);
        deleteByUser(conn, "user_follow_notifications", "follower_id", userId);
        deleteByUser(conn, "user_follow_notifications", "followed_id", userId);
    }

    private void deleteByUser(Connection conn, String table, String column, Long userId) throws SQLException {
        String sql = "DELETE FROM " + table + " WHERE " + column + " = ?";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, userId);
            stmt.executeUpdate();
        }
    }
    private void insertUser(Connection conn, User user) throws SQLException {
        String sql = "INSERT INTO users (name, email, password_hash, birthdate, profile_image, profile_image_data, "
                + "description, is_admin) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        try (PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            bindUserBase(stmt, user, false);
            stmt.executeUpdate();
            try (ResultSet keys = stmt.getGeneratedKeys()) {
                if (keys.next()) {
                    user.setId(keys.getLong(1));
                }
            }
        }
    }

    private void updateUser(Connection conn, User user) throws SQLException {
        String sql = "UPDATE users SET name = ?, email = ?, password_hash = ?, birthdate = ?, profile_image = ?, "
                + "profile_image_data = ?, description = ?, is_admin = ? WHERE id = ?";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            bindUserBase(stmt, user, true);
            stmt.executeUpdate();
        }
    }

    private void bindUserBase(PreparedStatement stmt, User user, boolean includeId) throws SQLException {
        stmt.setString(1, user.getName());
        stmt.setString(2, user.getEmail());
        stmt.setString(3, user.getPasswordHash());
        if (user.getBirthdate() != null && !user.getBirthdate().isBlank()) {
            stmt.setObject(4, LocalDate.parse(user.getBirthdate()));
        } else {
            stmt.setObject(4, null);
        }
        stmt.setString(5, user.getProfileImage());
        stmt.setBytes(6, user.getProfileImageData());
        stmt.setString(7, user.getDescription());
        stmt.setBoolean(8, user.getIsAdmin());
        if (includeId) {
            stmt.setLong(9, user.getId());
        }
    }

    private void syncUserRelations(Connection conn, User user) throws SQLException {
        Long userId = user.getId();
        syncUserEventJoin(conn, "user_participations", "user_id", "event_id", userId, user.getParticipatingEvents());
        syncUserEventJoin(conn, "user_saved", "user_id", "event_id", userId, user.getSavedEvents());
        syncUserEventJoin(conn, "user_pending_participations", "user_id", "event_id", userId, user.getPendingEvents());
        syncUserUserJoin(conn, "user_follows", "follower_id", "followed_id", userId, user.getFollowing());
        syncUserUserJoin(conn, "user_follow_notifications", "follower_id", "followed_id", userId, user.getFollowNotifications());
    }

    private void hydrateUserRelations(User user) {
        if (user == null || user.getId() == null) {
            return;
        }
        Long userId = user.getId();
        user.setParticipatingEvents(loadUserEvents(userId, "user_participations"));
        user.setSavedEvents(loadUserEvents(userId, "user_saved"));
        user.setPendingEvents(loadUserEvents(userId, "user_pending_participations"));
        user.setFollowing(loadUserUsers(userId, "user_follows", "follower_id", "followed_id"));
        user.setFollowers(loadUserUsers(userId, "user_follows", "followed_id", "follower_id"));
        user.setFollowNotifications(loadUserUsers(userId, "user_follow_notifications", "follower_id", "followed_id"));
    }

    private Set<Event> loadUserEvents(Long userId, String joinTable) {
        Set<Event> events = new LinkedHashSet<>();
        String sql = "SELECT "
                + "e.id as e_id, e.title as e_title, e.description as e_description, e.n_partecipants as e_n_partecipants, "
                + "e.city as e_city, e.date as e_date, e.end_date as e_end_date, e.start_time as e_start_time, "
                + "e.end_time as e_end_time, e.created_at as e_created_at, e.latitude as e_latitude, "
                + "e.longitude as e_longitude, e.cost_per_person as e_cost_per_person, e.is_approved as e_is_approved, "
                + "u.id as c_id, u.name as c_name, u.email as c_email, u.password_hash as c_password_hash, "
                + "u.birthdate as c_birthdate, u.profile_image as c_profile_image, "
                + "u.profile_image_data as c_profile_image_data, u.description as c_description, u.is_admin as c_is_admin "
                + "FROM \"event\" e "
                + "LEFT JOIN users u ON e.creator_id = u.id "
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
            throw new DaoException("UserDao.loadUserEvents failed", ex);
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
                    users.add(mapUserBase(rs, ""));
                }
            }
            return users;
        } catch (SQLException ex) {
            throw new DaoException("UserDao.loadUserUsers failed", ex);
        }
    }

    private void normalizeRelations(User user) {
        Set<Event> participating = sanitizeEvents(user.getParticipatingEvents());
        Set<Event> pending = sanitizeEvents(user.getPendingEvents());
        Set<Event> saved = sanitizeEvents(user.getSavedEvents());
        Set<User> following = sanitizeUsers(user.getFollowing(), user.getId());
        Set<User> followNotifications = sanitizeUsers(user.getFollowNotifications(), user.getId());

        // A user cannot be both pending and accepted for the same event.
        pending.removeIf(event -> event != null && participating.stream().anyMatch(p -> p.getId().equals(event.getId())));

        // Notifications can only be enabled for users that are actually followed.
        followNotifications.removeIf(target -> target != null
                && following.stream().noneMatch(f -> f.getId().equals(target.getId())));

        user.setParticipatingEvents(participating);
        user.setPendingEvents(pending);
        user.setSavedEvents(saved);
        user.setFollowing(following);
        user.setFollowNotifications(followNotifications);
    }

    private Set<Event> sanitizeEvents(Set<Event> events) {
        if (events == null || events.isEmpty()) {
            return new HashSet<>();
        }
        Map<Long, Event> unique = new LinkedHashMap<>();
        for (Event event : events) {
            if (event == null || event.getId() == null) {
                continue;
            }
            unique.putIfAbsent(event.getId(), event);
        }
        return new LinkedHashSet<>(unique.values());
    }

    private Set<User> sanitizeUsers(Set<User> users, Long selfId) {
        if (users == null || users.isEmpty()) {
            return new HashSet<>();
        }
        Map<Long, User> unique = new LinkedHashMap<>();
        for (User user : users) {
            if (user == null || user.getId() == null) {
                continue;
            }
            if (selfId != null && selfId.equals(user.getId())) {
                continue;
            }
            unique.putIfAbsent(user.getId(), user);
        }
        return new LinkedHashSet<>(unique.values());
    }

    private void syncUserEventJoin(Connection conn, String table, String leftColumn, String rightColumn, Long userId,
                                   Set<Event> events) throws SQLException {
        String deleteSql = "DELETE FROM " + table + " WHERE " + leftColumn + " = ?";
        try (PreparedStatement deleteStmt = conn.prepareStatement(deleteSql)) {
            deleteStmt.setLong(1, userId);
            deleteStmt.executeUpdate();
        }

        if (events == null || events.isEmpty()) {
            return;
        }

        String insertSql = "INSERT INTO " + table + " (" + leftColumn + ", " + rightColumn + ") VALUES (?, ?)";
        try (PreparedStatement insertStmt = conn.prepareStatement(insertSql)) {
            for (Event event : events) {
                if (event == null || event.getId() == null) {
                    continue;
                }
                insertStmt.setLong(1, userId);
                insertStmt.setLong(2, event.getId());
                insertStmt.addBatch();
            }
            insertStmt.executeBatch();
        }
    }

    private void syncUserUserJoin(Connection conn, String table, String leftColumn, String rightColumn, Long userId,
                                  Set<User> users) throws SQLException {
        String deleteSql = "DELETE FROM " + table + " WHERE " + leftColumn + " = ?";
        try (PreparedStatement deleteStmt = conn.prepareStatement(deleteSql)) {
            deleteStmt.setLong(1, userId);
            deleteStmt.executeUpdate();
        }

        if (users == null || users.isEmpty()) {
            return;
        }

        String insertSql = "INSERT INTO " + table + " (" + leftColumn + ", " + rightColumn + ") VALUES (?, ?)";
        try (PreparedStatement insertStmt = conn.prepareStatement(insertSql)) {
            for (User u : users) {
                if (u == null || u.getId() == null) {
                    continue;
                }
                insertStmt.setLong(1, userId);
                insertStmt.setLong(2, u.getId());
                insertStmt.addBatch();
            }
            insertStmt.executeBatch();
        }
    }

    private User mapUserBase(ResultSet rs, String prefix) throws SQLException {
        User user = new UserProxy(dataSource);
        user.setId(rs.getLong(prefix + "id"));
        user.setName(rs.getString(prefix + "name"));
        user.setEmail(rs.getString(prefix + "email"));
        user.setPasswordHash(rs.getString(prefix + "password_hash"));
        user.setBirthdate(rs.getString(prefix + "birthdate"));
        user.setProfileImage(rs.getString(prefix + "profile_image"));
        user.setProfileImageData(rs.getBytes(prefix + "profile_image_data"));
        user.setDescription(rs.getString(prefix + "description"));
        user.setIsAdmin(rs.getBoolean(prefix + "is_admin"));
        return user;
    }

    private Event mapEventShallow(ResultSet rs) throws SQLException {
        Event event = new EventProxy(dataSource);
        event.setId(rs.getLong("e_id"));
        event.setTitle(rs.getString("e_title"));
        event.setDescription(rs.getString("e_description"));
        event.setnPartecipants(rs.getInt("e_n_partecipants"));
        event.setCity(rs.getString("e_city"));
        event.setDate(parseLocalDate(rs.getString("e_date")));
        event.setEndDate(parseLocalDate(rs.getString("e_end_date")));
        event.setStartTime(rs.getObject("e_start_time", java.time.LocalTime.class));
        event.setEndTime(rs.getObject("e_end_time", java.time.LocalTime.class));
        event.setCreatedAt(rs.getObject("e_created_at", java.time.LocalDateTime.class));
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

    private LocalDate parseLocalDate(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return LocalDate.parse(value);
    }

}
