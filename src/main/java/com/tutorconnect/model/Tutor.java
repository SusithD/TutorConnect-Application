package com.tutorconnect.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tutors")
@PrimaryKeyJoinColumn(name = "user_id")
public class Tutor extends User {
    
    @Column
    private String bio;
    
    @Column
    private String title;
    
    @Column
    private Double hourlyRate;
    
    @Column
    private Integer yearsOfExperience;
    
    @Column
    private String profilePictureUrl;
    
    @Column
    private Double averageRating = 0.0;
    
    @Column
    private Integer totalReviews = 0;
    
    @OneToMany(mappedBy = "tutor", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<TutorExpertise> expertises = new HashSet<>();
    
    @OneToMany(mappedBy = "tutor", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<TutorSchedule> schedules = new HashSet<>();
    
    @OneToMany(mappedBy = "tutor", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Booking> bookings = new HashSet<>();
    
    @OneToMany(mappedBy = "tutor", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Review> reviews = new HashSet<>();
    
    @ManyToMany
    @JoinTable(
        name = "tutor_subjects",
        joinColumns = @JoinColumn(name = "tutor_id"),
        inverseJoinColumns = @JoinColumn(name = "subject_id")
    )
    private Set<Subject> subjects = new HashSet<>();
    
    // Helper method to add a subject
    public void addSubject(Subject subject) {
        this.subjects.add(subject);
        subject.getTutors().add(this);
    }
    
    // Helper method to remove a subject
    public void removeSubject(Subject subject) {
        this.subjects.remove(subject);
        subject.getTutors().remove(this);
    }
    
    // Method to update average rating
    public void updateRating(Integer oldRating, Integer newRating) {
        if (oldRating != null) {
            // Updating an existing rating
            double totalScore = averageRating * totalReviews;
            totalScore = totalScore - oldRating + newRating;
            this.averageRating = totalScore / totalReviews;
        } else {
            // Adding a new rating
            double totalScore = averageRating * totalReviews;
            totalScore += newRating;
            this.totalReviews++;
            this.averageRating = totalScore / totalReviews;
        }
    }
    
    // Method to remove a rating
    public void removeRating(Integer rating) {
        if (totalReviews > 1) {
            double totalScore = averageRating * totalReviews;
            totalScore -= rating;
            this.totalReviews--;
            this.averageRating = totalScore / totalReviews;
        } else {
            this.averageRating = 0.0;
            this.totalReviews = 0;
        }
    }
}