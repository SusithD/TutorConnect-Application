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
@Table(name = "bookings")
public class Booking {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;
    
    @ManyToOne
    @JoinColumn(name = "tutor_id", nullable = false)
    private Tutor tutor;
    
    @ManyToOne
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;
    
    @Column(nullable = false)
    private LocalDateTime startTime;
    
    @Column(nullable = false)
    private LocalDateTime endTime;
    
    @Column
    private String meetingLink;
    
    @Column
    private String notes;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private BookingStatus status = BookingStatus.PENDING;
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column
    private LocalDateTime updatedAt;
    
    public enum BookingStatus {
        PENDING, CONFIRMED, COMPLETED, CANCELLED, REJECTED
    }
    
    public Booking(Student student, Tutor tutor, Subject subject, LocalDateTime startTime, LocalDateTime endTime) {
        this.student = student;
        this.tutor = tutor;
        this.subject = subject;
        this.startTime = startTime;
        this.endTime = endTime;
    }
    
    // Method to confirm a booking
    public void confirm() {
        this.status = BookingStatus.CONFIRMED;
        this.updatedAt = LocalDateTime.now();
    }
    
    // Method to complete a booking
    public void complete() {
        this.status = BookingStatus.COMPLETED;
        this.updatedAt = LocalDateTime.now();
    }
    
    // Method to cancel a booking
    public void cancel() {
        this.status = BookingStatus.CANCELLED;
        this.updatedAt = LocalDateTime.now();
    }
    
    // Method to reject a booking
    public void reject() {
        this.status = BookingStatus.REJECTED;
        this.updatedAt = LocalDateTime.now();
    }
}