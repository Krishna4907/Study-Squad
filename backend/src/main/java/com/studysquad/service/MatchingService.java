package com.studysquad.service;

import com.studysquad.model.UserProfile;
import com.studysquad.model.MatchResult;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MatchingService {

    public List<MatchResult> findMatches(UserProfile currentUser, List<UserProfile> allUsers) {
        List<MatchResult> matches = new ArrayList<>();

        for (UserProfile target : allUsers) {
            // Don't match with self
            if (target.getId() != null && target.getId().equals(currentUser.getId())) continue;
            if (target.getFirebaseUid() != null && target.getFirebaseUid().equals(currentUser.getFirebaseUid())) continue;

            int score = 0;
            int maxScore = 100;

            // 1. Shared Courses (Highest weight - 40 points)
            List<String> sharedCourses = new ArrayList<>();
            if (currentUser.getCourses() != null && target.getCourses() != null) {
                target.getCourses().forEach(c -> {
                    String cleanCourse = c.trim().toLowerCase();
                    for (String myC : currentUser.getCourses()) {
                        if (myC.trim().toLowerCase().equals(cleanCourse)) {
                            sharedCourses.add(c.trim());
                        }
                    }
                });
                if (!sharedCourses.isEmpty()) {
                    score += 40; // Full 40 if they share at least one course
                }
            }

            // 2. Availability/Schedule Match (30 points)
            String availabilityInfo = "Schedules don't easily align";
            if (currentUser.getAvailability() != null && 
                currentUser.getAvailability().equals(target.getAvailability())) {
                score += 30;
                availabilityInfo = "Matches your availability: " + target.getAvailability();
            } else if (currentUser.getScheduleFocus() != null && 
                       currentUser.getScheduleFocus().equals(target.getScheduleFocus())) {
                score += 15;
                availabilityInfo = "Both prefer studying during: " + target.getScheduleFocus();
            }

            // 3. Learning Style Match (30 points)
            String styleInfo = "Different learning style preferences";
            if (currentUser.getLearningStyle() != null && 
                currentUser.getLearningStyle().equals(target.getLearningStyle())) {
                score += 30;
                styleInfo = "Similar style: Both are " + target.getLearningStyle() + " learners";
            } else {
                // If not similar, maybe complimentary styles
                score += 10;
                styleInfo = "Complementary styles: target is " + target.getLearningStyle();
            }

            // Must share at least one course to be a valid "study partner" match
            if (!sharedCourses.isEmpty()) {
                matches.add(new MatchResult(
                        target.getId(),
                        target.getName(),
                        score,
                        sharedCourses,
                        availabilityInfo,
                        styleInfo,
                        target.getRating(),
                        target.getRecentActivity()
                ));
            }
        }

        // Sort by highest compatibility
        return matches.stream()
                .sorted((a, b) -> Integer.compare(b.getCompatibilityPercentage(), a.getCompatibilityPercentage()))
                .collect(Collectors.toList());
    }
}
