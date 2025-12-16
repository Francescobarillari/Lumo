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

    @Query("SELECT e FROM Event e " +
            "LEFT JOIN e.participants p " +
            "WHERE (LOWER(e.title) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "OR LOWER(e.city) LIKE LOWER(CONCAT('%', :query, '%'))) " +
            "AND e.isApproved = true")
    List<Event> searchEvents(@Param("query") String query);
}
