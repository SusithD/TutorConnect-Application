package com.tutorconnect.service;

import com.tutorconnect.model.Notification;
import com.tutorconnect.model.Review;
import com.tutorconnect.model.Tutor;
import com.tutorconnect.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewService {
    
    private final ReviewRepository reviewRepository;
    private final NotificationService notificationService;
    
    public List<Review> findAllReviews() {
        return reviewRepository.findAll();
    }
    
    public Optional<Review> findReviewById(Long id) {
        return reviewRepository.findById(id);
    }
    
    public List<Review> findReviewsByTutorId(Long tutorId) {
        return reviewRepository.findByTutorIdOrderByCreatedAtDesc(tutorId);
    }
    
    public List<Review> findReviewsByStudentId(Long studentId) {
        return reviewRepository.findByStudentIdOrderByCreatedAtDesc(studentId);
    }
    
    public Optional<Review> findReviewByBookingId(Long bookingId) {
        return reviewRepository.findByBookingId(bookingId);
    }
    
    @Transactional
    public Review createReview(Review review) {
        Tutor tutor = review.getTutor();
        tutor.updateRating(null, review.getRating());
        
        Review savedReview = reviewRepository.save(review);
        
        // Send notification to tutor
        notificationService.createNotification(
                tutor,
                "New Review",
                "You have received a new review from " + review.getStudent().getFullName(),
                Notification.NotificationType.SYSTEM_ALERT,
                "/tutor/reviews");
        
        return savedReview;
    }
    
    @Transactional
    public Review updateReview(Long id, Integer rating, String comment) {
        return reviewRepository.findById(id).map(review -> {
            // Get the old rating for updating tutor's average
            Integer oldRating = review.getRating();
            
            // Update the review
            review.update(rating, comment);
            
            // Update the tutor's average rating
            Tutor tutor = review.getTutor();
            tutor.updateRating(oldRating, rating);
            
            return reviewRepository.save(review);
        }).orElseThrow(() -> new RuntimeException("Review not found"));
    }
    
    @Transactional
    public void deleteReview(Long id) {
        reviewRepository.findById(id).ifPresent(review -> {
            // Update the tutor's average rating
            Tutor tutor = review.getTutor();
            tutor.removeRating(review.getRating());
            
            // Delete the review
            reviewRepository.delete(review);
        });
    }
}