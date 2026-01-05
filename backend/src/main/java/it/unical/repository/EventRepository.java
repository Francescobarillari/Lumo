package it.unical.repository;

import it.unical.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    @Query("SELECT e FROM Event e LEFT JOIN FETCH e.creator ORDER BY e.date ASC, e.startTime ASC")
    List<Event> findAllByOrderByDateAscStartTimeAsc();

    @Query("SELECT e FROM Event e LEFT JOIN FETCH e.creator WHERE e.isApproved = true ORDER BY e.date ASC, e.startTime ASC")
    List<Event> findByIsApprovedTrueOrderByDateAscStartTimeAsc();

    @Query("SELECT e FROM Event e LEFT JOIN FETCH e.creator WHERE e.isApproved = false ORDER BY e.date ASC, e.startTime ASC")
    List<Event> findByIsApprovedFalseOrderByDateAscStartTimeAsc();

    List<Event> findByCreator_Id(Long creatorId);

    @Query("SELECT e FROM Event e " +
            "LEFT JOIN FETCH e.creator " +
            "LEFT JOIN e.participants p " +
            "WHERE (LOWER(e.title) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "OR LOWER(e.city) LIKE LOWER(CONCAT('%', :query, '%'))) " +
            "AND e.isApproved = true")
    List<Event> searchEvents(@Param("query") String query);

    int countByCreator_IdAndIsApprovedTrue(Long creatorId);
}
