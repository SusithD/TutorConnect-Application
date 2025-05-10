package com.tutorconnect.repository;

import com.tutorconnect.model.Tutor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TutorRepository extends JpaRepository<Tutor, Long> {
    List<Tutor> findBySubjectsId(Long subjectId);
    
    @Query("SELECT t FROM Tutor t ORDER BY t.averageRating DESC")
    List<Tutor> findAllByOrderByRatingDesc();
    
    @Query("SELECT t FROM Tutor t ORDER BY t.yearsOfExperience DESC")
    List<Tutor> findAllByOrderByExperienceDesc();
    
    @Query("SELECT t FROM Tutor t WHERE t.averageRating >= :minRating")
    List<Tutor> findByMinimumRating(Double minRating);
    
    @Query("SELECT t FROM Tutor t WHERE LOWER(t.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(t.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(t.bio) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Tutor> findByKeyword(String keyword);
}