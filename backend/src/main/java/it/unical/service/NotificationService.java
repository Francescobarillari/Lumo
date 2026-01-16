package it.unical.service;

import it.unical.model.Event;
import it.unical.model.Notification;
import it.unical.model.User;
import it.unical.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service("realNotificationService")
@Transactional
public class NotificationService implements INotificationService {

    @Autowired
    private NotificationRepository notificationRepo;

    @Autowired
    private it.unical.repository.UserRepository userRepo;

    @Autowired
    private it.unical.repository.EventRepository eventRepo;

    public List<Notification> getUserNotifications(Long userId) {
        checkAndCreateFollowUpNotifications(userId);
        return notificationRepo.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public void createNotification(Long userId, String title, String message, String type) {
        Notification n = new Notification(userId, title, message, type);
        notificationRepo.save(n);
    }

    public void createRichNotification(Long userId, String title, String message, String type, Long relatedEventId,
            Long relatedUserId) {
        Notification n = new Notification(userId, title, message, type, relatedEventId, relatedUserId);
        notificationRepo.save(n);
    }

    public void markAsRead(Long notificationId) {
        notificationRepo.findById(notificationId).ifPresent(n -> {
            n.setIsRead(true);
            notificationRepo.save(n);
        });
    }

    public void markAllAsRead(Long userId) {
        List<Notification> userNotifications = notificationRepo.findByUserIdOrderByCreatedAtDesc(userId);
        for (Notification n : userNotifications) {
            if (!n.getIsRead()) {
                n.setIsRead(true);
                notificationRepo.save(n);
            }
        }
    }

    public void updateType(Long notificationId, String newType) {
        notificationRepo.findById(notificationId).ifPresent(n -> {
            n.setType(newType);
            notificationRepo.save(n);
        });
    }

    public void deleteNotification(Long notificationId) {
        notificationRepo.deleteById(notificationId);
    }

    @Override
    public void deleteReadNotifications(Long userId) {
        notificationRepo.deleteByUserIdAndIsReadTrue(userId);
    }

    @Override
    public void clearParticipationRequestNotification(Long creatorId, Long eventId, Long requesterId) {
        if (creatorId == null || eventId == null || requesterId == null)
            return;
        notificationRepo.deleteByUserIdAndRelatedEventIdAndRelatedUserIdAndType(
                creatorId,
                eventId,
                requesterId,
                "PARTICIPATION_REQUEST");
    }

    // Notifiche di follow-up per eventi imminenti.
    private void checkAndCreateFollowUpNotifications(Long userId) {
        User user = userRepo.findById(userId).orElse(null);
        if (user == null)
            return;

        List<Notification> existingNotifications = notificationRepo.findByUserIdOrderByCreatedAtDesc(userId);
        LocalDate today = LocalDate.now();
        LocalDate threeDaysFromNow = today.plusDays(3);

        for (Event event : user.getParticipatingEvents()) {
            if (event.getCreatorId() != null && event.getCreatorId().equals(userId)) {
                continue;
            }

            if (event.getDate() != null && !event.getDate().isBefore(today)
                    && !event.getDate().isAfter(threeDaysFromNow)) {

                String expectedTitle = "Upcoming event: " + event.getTitle();
                Notification existingNotification = existingNotifications.stream()
                        .filter(n -> "FOLLOWUP".equals(n.getType()) && n.getTitle().equals(expectedTitle))
                        .findFirst()
                        .orElse(null);

                // Evita duplicati per lo stesso evento.
                if (existingNotification != null) {
                    if (existingNotification.getRelatedEventId() == null) {
                        existingNotification.setRelatedEventId(event.getId());
                        notificationRepo.save(existingNotification);
                    }
                    continue;
                }

                createRichNotification(userId, expectedTitle,
                        "The event '" + event.getTitle() + "' is about to start (" + event.getDate()
                                + ")! Get ready.",
                        "FOLLOWUP", event.getId(), null);
            }
        }
    }
}
