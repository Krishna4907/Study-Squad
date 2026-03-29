package com.studysquad.model;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MatchResult {
    private Long profileId;
    private String name;
    private int compatibilityPercentage;
    
    private List<String> sharedCourses;
    private String availabilityInfo;
    private String styleMatch;
    
    private double rating;
    private String recentActivity;
}
