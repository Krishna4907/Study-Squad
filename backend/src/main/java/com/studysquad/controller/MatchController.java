package com.studysquad.controller;

import com.studysquad.model.UserProfile;
import com.studysquad.model.MatchResult;
import com.studysquad.service.MatchingService;
import com.studysquad.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class MatchController {

    @Autowired
    private MatchingService matchingService;
    
    @Autowired
    private UserProfileRepository userProfileRepository;

    @PostMapping("/profile")
    public ResponseEntity<String> saveProfile(@RequestBody UserProfile profile) {
        // If a profile for this UID already exists, update it, otherwise save new
        Optional<UserProfile> existing = userProfileRepository.findByFirebaseUid(profile.getFirebaseUid());
        if(existing.isPresent()) {
            profile.setId(existing.get().getId());
        }
        userProfileRepository.save(profile);
        return ResponseEntity.ok("Profile saved successfully to Database!");
    }

    @PostMapping("/matches")
    public List<MatchResult> getMatches(@RequestBody UserProfile currentUser) {
        // Find the full currentUser data from the database
        Optional<UserProfile> dbUserOpt = userProfileRepository.findByFirebaseUid(currentUser.getFirebaseUid());
        
        if (!dbUserOpt.isPresent()) {
            return List.of(); // Return empty if user has no profile
        }
        
        UserProfile dbUser = dbUserOpt.get();
        List<UserProfile> allUsers = userProfileRepository.findAll();
        
        return matchingService.findMatches(dbUser, allUsers);
    }
}
