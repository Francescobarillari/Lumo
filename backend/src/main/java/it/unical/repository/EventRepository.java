package it.unical.repository;

import it.unical.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findAllByOrderByDateAscStartTimeAsc();

    List<Event> findByIsApprovedTrueOrderByDateAscStartTimeAsc();

    List<Event> findByIsApprovedFalseOrderByDateAscStartTimeAsc();

    @Query(value = "SELECT DISTINCT e.* FROM event e " +
            "LEFT JOIN user_participations up ON e.id = up.event_id " +
            "LEFT JOIN users u ON up.user_id = u.id " +
            "WHERE (LOWER(e.title) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "OR LOWER(e.city) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "OR LOWER(u.name) LIKE LOWER(CONCAT('%', :query, '%'))) " +
            "AND e.is_approved = true " +
            "ORDER BY e.date ASC, e.start_time ASC", nativeQuery = true)
    List<Event> searchEvents(@Param("query") String query);
}
