package it.unical.repository;

import it.unical.model.Event;
import it.unical.model.User;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@Repository
public class EventRepository {
    private final DataSource dataSource;

    public EventRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public List<Event> findAllByOrderByDateAscStartTimeAsc() {
        String sql = baseSelect() + " ORDER BY e.date ASC, e.start_time ASC";
        return fetchEventList(sql, stmt -> {});
    }

    public List<Event> findByIsApprovedTrueOrderByDateAscStartTimeAsc() {
        String sql = baseSelect() + " WHERE e.is_approved = true ORDER BY e.date ASC, e.start_time ASC";
        return fetchEventList(sql, stmt -> {});
    }

    public List<Event> findByIsApprovedFalseOrderByDateAscStartTimeAsc() {
        String sql = baseSelect() + " WHERE e.is_approved = false ORDER BY e.date ASC, e.start_time ASC";
        return fetchEventList(sql, stmt -> {});
    }

    public List<Event> findByCreator_Id(Long creatorId) {
        String sql = baseSelect() + " WHERE e.creator_id = ?";
        return fetchEventList(sql, stmt -> stmt.setLong(1, creatorId));
    }

    public List<Event> searchEvents(String query) {
        String sql = baseSelect()
                + " WHERE (LOWER(e.title) LIKE LOWER(?) OR LOWER(e.city) LIKE LOWER(?))"
                + " AND e.is_approved = true";
        return fetchEventList(sql, stmt -> {
            String value = "%" + query + "%";
            stmt.setString(1, value);
            stmt.setString(2, value);
        });
    }

    public int countByCreator_IdAndIsApprovedTrue(Long creatorId) {
        String sql = "SELECT COUNT(*) FROM \"event\" WHERE creator_id = ? AND is_approved = true";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, creatorId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1);
                }
                return 0;
            }
        } catch (SQLException ex) {
            throw new DaoException("EventRepository.countByCreator_IdAndIsApprovedTrue failed", ex);
        }
    }

    public Optional<Event> findById(Long id) {
        String sql = baseSelect() + " WHERE e.id = ?";
        List<Event> events = fetchEventList(sql, stmt -> stmt.setLong(1, id));
        return events.isEmpty() ? Optional.empty() : Optional.of(events.get(0));
    }

    public List<Event> findAll() {
        String sql = baseSelect();
        return fetchEventList(sql, stmt -> {});
    }

    public Event save(Event event) {
        if (event == null) {
            throw new IllegalArgumentException("EventRepository.save event is null");
        }

        if (event.getId() == null) {
            insertEvent(event);
        } else {
            updateEvent(event);
        }
        return event;
    }

    public void deleteById(Long id) {
        String sql = "DELETE FROM \"event\" WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, id);
            stmt.executeUpdate();
        } catch (SQLException ex) {
            throw new DaoException("EventRepository.deleteById failed", ex);
        }
    }

    private void insertEvent(Event event) {
        String sql = "INSERT INTO \"event\" (title, description, n_partecipants, city, date, end_date, "
                + "start_time, end_time, created_at, latitude, longitude, cost_per_person, is_approved, creator_id) "
                + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            bindEvent(stmt, event, false);
            stmt.executeUpdate();
            try (ResultSet keys = stmt.getGeneratedKeys()) {
                if (keys.next()) {
                    event.setId(keys.getLong(1));
                }
            }
        } catch (SQLException ex) {
            throw new DaoException("EventRepository.insertEvent failed", ex);
        }
    }

    private void updateEvent(Event event) {
        String sql = "UPDATE \"event\" SET title = ?, description = ?, n_partecipants = ?, city = ?, date = ?, "
                + "end_date = ?, start_time = ?, end_time = ?, created_at = ?, latitude = ?, longitude = ?, "
                + "cost_per_person = ?, is_approved = ?, creator_id = ? WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            bindEvent(stmt, event, true);
            stmt.executeUpdate();
        } catch (SQLException ex) {
            throw new DaoException("EventRepository.updateEvent failed", ex);
        }
    }

    private void bindEvent(PreparedStatement stmt, Event event, boolean includeId) throws SQLException {
        stmt.setString(1, event.getTitle());
        stmt.setString(2, event.getDescription());
        stmt.setInt(3, event.getnPartecipants());
        stmt.setString(4, event.getCity());
        stmt.setObject(5, event.getDate());
        stmt.setObject(6, event.getEndDate());
        stmt.setObject(7, event.getStartTime());
        stmt.setObject(8, event.getEndTime());
        stmt.setObject(9, event.getCreatedAt());
        stmt.setObject(10, event.getLatitude());
        stmt.setObject(11, event.getLongitude());
        stmt.setObject(12, event.getCostPerPerson());
        stmt.setBoolean(13, event.getIsApproved());
        stmt.setObject(14, event.getCreatorId());
        if (includeId) {
            stmt.setLong(15, event.getId());
        }
    }

    private String baseSelect() {
        return "SELECT "
                + "e.id as e_id, e.title as e_title, e.description as e_description, e.n_partecipants as e_n_partecipants, "
                + "e.city as e_city, e.date as e_date, e.end_date as e_end_date, e.start_time as e_start_time, "
                + "e.end_time as e_end_time, e.created_at as e_created_at, e.latitude as e_latitude, "
                + "e.longitude as e_longitude, e.cost_per_person as e_cost_per_person, e.is_approved as e_is_approved, "
                + "e.creator_id as e_creator_id, "
                + "u.id as c_id, u.name as c_name, u.email as c_email, u.password_hash as c_password_hash, "
                + "u.birthdate as c_birthdate, u.profile_image as c_profile_image, "
                + "u.profile_image_data as c_profile_image_data, u.description as c_description, u.is_admin as c_is_admin "
                + "FROM \"event\" e "
                + "LEFT JOIN users u ON e.creator_id = u.id";
    }

    private interface StatementBinder {
        void bind(PreparedStatement stmt) throws SQLException;
    }

    private List<Event> fetchEventList(String sql, StatementBinder binder) {
        List<Event> events = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            binder.bind(stmt);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    Event event = mapEvent(rs);
                    loadEventRelations(conn, event);
                    events.add(event);
                }
            }
            return events;
        } catch (SQLException ex) {
            throw new DaoException("EventRepository.fetchEventList failed", ex);
        }
    }

    private Event mapEvent(ResultSet rs) throws SQLException {
        Event event = new Event();
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
            User creator = new User();
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

    private void loadEventRelations(Connection conn, Event event) throws SQLException {
        if (event.getId() == null) {
            return;
        }
        event.setParticipants(loadEventUsers(conn, "user_participations", event.getId()));
        event.setPendingParticipants(loadEventUsers(conn, "user_pending_participations", event.getId()));
        event.setUsersWhoSaved(loadEventUsers(conn, "user_saved", event.getId()));
    }

    private Set<User> loadEventUsers(Connection conn, String joinTable, Long eventId) throws SQLException {
        String sql = "SELECT u.id, u.name, u.email, u.password_hash, u.birthdate, u.profile_image, "
                + "u.profile_image_data, u.description, u.is_admin FROM users u "
                + "JOIN " + joinTable + " j ON j.user_id = u.id WHERE j.event_id = ?";
        Set<User> users = new HashSet<>();
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, eventId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    users.add(mapUser(rs));
                }
            }
        }
        return users;
    }

    private User mapUser(ResultSet rs) throws SQLException {
        User user = new User();
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
