package com.tutorconnect.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "chat_rooms")
public class ChatRoom {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;
    
    @ManyToOne
    @JoinColumn(name = "tutor_id", nullable = false)
    private Tutor tutor;
    
    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Message> messages = new ArrayList<>();
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column
    private LocalDateTime lastMessageAt;
    
    public ChatRoom(Student student, Tutor tutor) {
        this.student = student;
        this.tutor = tutor;
    }
    
    // Add a message to the chat room
    public void addMessage(Message message) {
        messages.add(message);
        this.lastMessageAt = message.getSentAt();
    }
    
    // Get unread message count for a user
    public int getUnreadMessageCount(User user) {
        return (int) messages.stream()
                .filter(message -> !message.isRead() && !message.getSender().equals(user))
                .count();
    }
}