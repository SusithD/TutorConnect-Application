package com.tutorconnect.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "notifications")
public class Notification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false)
    private String message;
    
    @Column(nullable = false)
    private boolean read = false;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private NotificationType type;
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column
    private String link;
    
    public enum NotificationType {
        BOOKING_REQUEST, BOOKING_CONFIRMATION, BOOKING_CANCELLATION, 
        NEW_MESSAGE, SYSTEM_ALERT, PAYMENT
    }
    
    public Notification(User user, String title, String message, NotificationType type, String link) {
        this.user = user;
        this.title = title;
        this.message = message;
        this.type = type;
        this.link = link;
    }
    
    // Method to mark notification as read
    public void markAsRead() {
        this.read = true;
    }
}