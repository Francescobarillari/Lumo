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
        // Trigger check for Follow Up events logic here (lazy check)
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

    // Check for events starting within 3 days that the user follows/participates in
    private void checkAndCreateFollowUpNotifications(Long userId) {
        User user = userRepo.findById(userId).orElse(null);
        if (user == null)
            return;

        LocalDate today = LocalDate.now();
        LocalDate threeDaysFromNow = today.plusDays(3);

        for (Event event : user.getParticipatingEvents()) {
            if (event.getDate() != null && !event.getDate().isBefore(today)
                    && !event.getDate().isAfter(threeDaysFromNow)) {

                // Check if we already notified this event as "Follow Up"
                // This is a naive check. Ideally we store "notifiedEvents" table or check
                // existing notifications text.
                // For simplicity, we assume if a notification with this title exists recently,
                // we skip.
                // Or proper way: Add 'relatedEventId' to Notification entity.
                // For now, let's just create it if we haven't done so today?
                // Let's create it only if NO notification of type 'FOLLOWUP' exists for this
                // user with title containing event title.

                String expectedTitle = "Evento in arrivo: " + event.getTitle();
                boolean alreadyNotified = notificationRepo.findByUserIdOrderByCreatedAtDesc(userId).stream()
                        .anyMatch(n -> "FOLLOWUP".equals(n.getType()) && n.getTitle().equals(expectedTitle));

                if (!alreadyNotified) {
                    createNotification(userId, expectedTitle,
                            "L'evento '" + event.getTitle() + "' sta per iniziare (" + event.getDate()
                                    + ")! Preparati.",
                            "FOLLOWUP");
                }
            }
        }
    }
}
