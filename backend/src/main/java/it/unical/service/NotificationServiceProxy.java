package it.unical.service;

import it.unical.model.Notification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Primary
public class NotificationServiceProxy implements INotificationService {

    private final INotificationService realService;

    @Autowired
    public NotificationServiceProxy(@Qualifier("realNotificationService") INotificationService realService) {
        this.realService = realService;
    }

    @Override
    public List<Notification> getUserNotifications(Long userId) {
        // System.out.println("[NotificationProxy] Fetching notifications for user: " +
        // userId);
        return realService.getUserNotifications(userId);
    }

    @Override
    public void createNotification(Long userId, String title, String message, String type) {
        System.out.println("[NotificationProxy] Sending notification to user " + userId + ": " + title);
        realService.createNotification(userId, title, message, type);
    }

    @Override
    public void createRichNotification(Long userId, String title, String message, String type, Long relatedEventId,
            Long relatedUserId) {
        System.out.println("[NotificationProxy] Sending RICH notification to user " + userId + ": " + title);
        realService.createRichNotification(userId, title, message, type, relatedEventId, relatedUserId);
    }

    @Override
    public void markAsRead(Long notificationId) {
        System.out.println("[NotificationProxy] Marked notification " + notificationId + " as read.");
        realService.markAsRead(notificationId);
    }

    @Override
    public void markAllAsRead(Long userId) {
        System.out.println("[NotificationProxy] Marked ALL notifications for user " + userId + " as read.");
        realService.markAllAsRead(userId);
    }

    @Override
    public void updateType(Long notificationId, String newType) {
        System.out.println("[NotificationProxy] Updating notification " + notificationId + " type to " + newType);
        realService.updateType(notificationId, newType);
    }

    @Override
    public void deleteNotification(Long notificationId) {
        System.out.println("[NotificationProxy] Deleting notification " + notificationId);
        realService.deleteNotification(notificationId);
    }
}
