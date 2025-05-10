package com.tutorconnect.service;

import com.tutorconnect.model.*;
import com.tutorconnect.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookingService {
    
    private final BookingRepository bookingRepository;
    private final NotificationService notificationService;
    
    public List<Booking> findAllBookings() {
        return bookingRepository.findAll();
    }
    
    public Optional<Booking> findBookingById(Long id) {
        return bookingRepository.findById(id);
    }
    
    public List<Booking> findBookingsByStudentId(Long studentId) {
        return bookingRepository.findByStudentId(studentId);
    }
    
    public List<Booking> findBookingsByTutorId(Long tutorId) {
        return bookingRepository.findByTutorId(tutorId);
    }
    
    public List<Booking> findUpcomingBookingsByStudentId(Long studentId) {
        LocalDateTime now = LocalDateTime.now();
        return bookingRepository.findByStudentIdAndEndTimeAfterAndStatusIn(
                studentId, now, List.of(Booking.BookingStatus.CONFIRMED, Booking.BookingStatus.PENDING));
    }
    
    public List<Booking> findUpcomingBookingsByTutorId(Long tutorId) {
        LocalDateTime now = LocalDateTime.now();
        return bookingRepository.findByTutorIdAndEndTimeAfterAndStatusIn(
                tutorId, now, List.of(Booking.BookingStatus.CONFIRMED, Booking.BookingStatus.PENDING));
    }
    
    @Transactional
    public Booking createBooking(Booking booking) {
        Booking savedBooking = bookingRepository.save(booking);
        
        // Send notifications
        notificationService.createNotification(
                booking.getTutor(), 
                "New Booking Request", 
                "You have a new booking request from " + booking.getStudent().getFullName(), 
                Notification.NotificationType.BOOKING_REQUEST,
                "/tutor/bookings/" + savedBooking.getId());
        
        return savedBooking;
    }
    
    @Transactional
    public Booking confirmBooking(Long id) {
        return bookingRepository.findById(id).map(booking -> {
            booking.confirm();
            booking.setUpdatedAt(LocalDateTime.now());
            Booking savedBooking = bookingRepository.save(booking);
            
            // Send notification to student
            notificationService.createNotification(
                    booking.getStudent(),
                    "Booking Confirmed",
                    "Your booking with " + booking.getTutor().getFullName() + " has been confirmed.",
                    Notification.NotificationType.BOOKING_CONFIRMATION,
                    "/student/bookings/" + savedBooking.getId());
            
            return savedBooking;
        }).orElseThrow(() -> new RuntimeException("Booking not found"));
    }
    
    @Transactional
    public Booking completeBooking(Long id) {
        return bookingRepository.findById(id).map(booking -> {
            booking.complete();
            booking.setUpdatedAt(LocalDateTime.now());
            return bookingRepository.save(booking);
        }).orElseThrow(() -> new RuntimeException("Booking not found"));
    }
    
    @Transactional
    public Booking cancelBooking(Long id, User canceller) {
        return bookingRepository.findById(id).map(booking -> {
            booking.cancel();
            booking.setUpdatedAt(LocalDateTime.now());
            Booking savedBooking = bookingRepository.save(booking);
            
            // Determine who to notify
            User recipient = canceller.isStudent() ? booking.getTutor() : booking.getStudent();
            
            // Send notification
            notificationService.createNotification(
                    recipient,
                    "Booking Cancelled",
                    "Your booking with " + canceller.getFullName() + " has been cancelled.",
                    Notification.NotificationType.BOOKING_CANCELLATION,
                    canceller.isStudent() ? "/tutor/bookings/" : "/student/bookings/" + savedBooking.getId());
            
            return savedBooking;
        }).orElseThrow(() -> new RuntimeException("Booking not found"));
    }
    
    @Transactional
    public Booking rejectBooking(Long id) {
        return bookingRepository.findById(id).map(booking -> {
            booking.reject();
            booking.setUpdatedAt(LocalDateTime.now());
            Booking savedBooking = bookingRepository.save(booking);
            
            // Send notification to student
            notificationService.createNotification(
                    booking.getStudent(),
                    "Booking Rejected",
                    "Your booking with " + booking.getTutor().getFullName() + " has been rejected.",
                    Notification.NotificationType.BOOKING_CANCELLATION,
                    "/student/bookings/" + savedBooking.getId());
            
            return savedBooking;
        }).orElseThrow(() -> new RuntimeException("Booking not found"));
    }
    
    @Transactional
    public Booking updateBookingNotes(Long id, String notes) {
        return bookingRepository.findById(id).map(booking -> {
            booking.setNotes(notes);
            booking.setUpdatedAt(LocalDateTime.now());
            return bookingRepository.save(booking);
        }).orElseThrow(() -> new RuntimeException("Booking not found"));
    }
}