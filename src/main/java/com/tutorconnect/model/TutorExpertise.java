package com.tutorconnect.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tutor_expertise")
public class TutorExpertise {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "tutor_id", nullable = false)
    private Tutor tutor;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false)
    private String description;
    
    @Column
    private String institution;
    
    @Column
    private Integer yearObtained;
    
    @Column
    private String certificateUrl;
    
    @Column
    private boolean verified = false;
    
    public TutorExpertise(Tutor tutor, String title, String description, String institution, Integer yearObtained) {
        this.tutor = tutor;
        this.title = title;
        this.description = description;
        this.institution = institution;
        this.yearObtained = yearObtained;
    }
}