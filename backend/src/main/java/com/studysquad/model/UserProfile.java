package com.studysquad.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Entity
@Table(name = "user_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Firebase Auth UID
    @Column(unique = true, nullable = false)
    private String firebaseUid;

    private String name;
    private String yearOfStudy;
    private String branch;
    
    // For simplicity, store as comma separated strings or element collections
    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> courses;

    private String learningStyle;
    private String scheduleFocus;
    private String sessionLength;
    private String availability;
    private String goals;
    
    // Dummy fields to mimic real world ratings and activity
    private double rating = 5.0;
    private String recentActivity = "Just joined StudySquad!";
}
