package com.tutorconnect.service;

import com.tutorconnect.model.Notification;
import com.tutorconnect.model.User;
import com.tutorconnect.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {
    
    private final NotificationRepository notificationRepository;
    
    public List<Notification> findNotificationsByUserId(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    public List<Notification> findUnreadNotificationsByUserId(Long userId) {
        return notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(userId);
    }
    
    public int countUnreadNotificationsByUserId(Long userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }
    
    @Transactional
    public Notification createNotification(User user, String title, String message, 
                                           Notification.NotificationType type, String link) {
        Notification notification = new Notification(user, title, message, type, link);
        return notificationRepository.save(notification);
    }
    
    @Transactional
    public void markNotificationAsRead(Long id) {
        notificationRepository.findById(id).ifPresent(notification -> {
            notification.markAsRead();
            notificationRepository.save(notification);
        });
    }
    
    @Transactional
    public void markAllNotificationsAsRead(Long userId) {
        List<Notification> unreadNotifications = notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(userId);
        
        for (Notification notification : unreadNotifications) {
            notification.markAsRead();
        }
        
        notificationRepository.saveAll(unreadNotifications);
    }
    
    @Transactional
    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }
}