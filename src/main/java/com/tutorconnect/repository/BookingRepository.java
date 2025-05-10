package com.tutorconnect.repository;

import com.tutorconnect.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByStudentId(Long studentId);
    List<Booking> findByTutorId(Long tutorId);
    
    List<Booking> findByStudentIdAndEndTimeAfterAndStatusIn(
            Long studentId, LocalDateTime now, List<Booking.BookingStatus> statuses);
    
    List<Booking> findByTutorIdAndEndTimeAfterAndStatusIn(
            Long tutorId, LocalDateTime now, List<Booking.BookingStatus> statuses);
    
    List<Booking> findByTutorIdAndStartTimeBetweenAndStatus(
            Long tutorId, LocalDateTime start, LocalDateTime end, Booking.BookingStatus status);
}