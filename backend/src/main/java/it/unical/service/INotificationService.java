package it.unical.service;

import it.unical.model.Notification;
import java.util.List;

public interface INotificationService {
    List<Notification> getUserNotifications(Long userId);

    void createNotification(Long userId, String title, String message, String type);

    void createRichNotification(Long userId, String title, String message, String type, Long relatedEventId,
            Long relatedUserId);

    void markAsRead(Long notificationId);

    void markAllAsRead(Long userId);

    void updateType(Long notificationId, String newType);

    void deleteNotification(Long notificationId);
}
