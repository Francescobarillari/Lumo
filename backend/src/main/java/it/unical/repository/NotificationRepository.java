package it.unical.repository;

import it.unical.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);

    void deleteByUserIdAndIsReadTrue(Long userId);

    void deleteByUserIdAndRelatedEventIdAndRelatedUserIdAndType(Long userId, Long relatedEventId, Long relatedUserId,
                                                                String type);
}
