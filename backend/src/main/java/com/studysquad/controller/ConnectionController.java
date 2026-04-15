package com.studysquad.controller;

import com.studysquad.model.ConnectionRequest;
import com.studysquad.model.UserProfile;
import com.studysquad.repository.ConnectionRequestRepository;
import com.studysquad.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/connections")
public class ConnectionController {

    @Autowired
    private ConnectionRequestRepository connectionRepository;

    @Autowired
    private UserProfileRepository userRepository;

    @PostMapping("/send")
    public ResponseEntity<?> sendRequest(@RequestBody Map<String, String> payload) {
        String senderUid = payload.get("senderFirebaseUid");
        Long receiverId = Long.parseLong(payload.get("receiverId"));
        String message = payload.get("message");

        Optional<UserProfile> senderOpt = userRepository.findByFirebaseUid(senderUid);
        Optional<UserProfile> receiverOpt = userRepository.findById(receiverId);

        if (senderOpt.isPresent() && receiverOpt.isPresent()) {
            Optional<ConnectionRequest> existing = connectionRepository.findBySenderAndReceiver(senderOpt.get(), receiverOpt.get());
            if (existing.isPresent()) {
                return ResponseEntity.badRequest().body("Request already exists");
            }

            ConnectionRequest req = new ConnectionRequest();
            req.setSender(senderOpt.get());
            req.setReceiver(receiverOpt.get());
            req.setMessage(message != null ? message : "Hey! Let's study together.");
            req.setStatus("PENDING");
            
            connectionRepository.save(req);
            return ResponseEntity.ok("Request sent successfully");
        }
        return ResponseEntity.badRequest().body("Users not found");
    }

    @GetMapping("/pending/{firebaseUid}")
    public ResponseEntity<List<ConnectionRequest>> getPendingRequests(@PathVariable String firebaseUid) {
        Optional<UserProfile> userOpt = userRepository.findByFirebaseUid(firebaseUid);
        if (userOpt.isPresent()) {
            List<ConnectionRequest> requests = connectionRepository.findByReceiverAndStatus(userOpt.get(), "PENDING");
            return ResponseEntity.ok(requests);
        }
        return ResponseEntity.badRequest().build();
    }

    @PostMapping("/respond")
    public ResponseEntity<?> respondRequest(@RequestBody Map<String, String> payload) {
        Long requestId = Long.parseLong(payload.get("requestId"));
        String action = payload.get("action");
        String scheduledTime = payload.get("scheduledTime");

        Optional<ConnectionRequest> reqOpt = connectionRepository.findById(requestId);
        if (reqOpt.isPresent()) {
            ConnectionRequest req = reqOpt.get();
            if ("ACCEPT".equalsIgnoreCase(action)) {
                req.setStatus("ACCEPTED");
                req.setMeetRoomId(UUID.randomUUID().toString()); 
                if (scheduledTime != null) {
                    req.setScheduledTime(scheduledTime);
                }
            } else {
                req.setStatus("REJECTED");
            }
            connectionRepository.save(req);
            return ResponseEntity.ok(req);
        }
        return ResponseEntity.badRequest().body("Request not found");
    }

    @GetMapping("/network/{firebaseUid}")
    public ResponseEntity<List<ConnectionRequest>> getNetwork(@PathVariable String firebaseUid) {
        Optional<UserProfile> userOpt = userRepository.findByFirebaseUid(firebaseUid);
        if (userOpt.isPresent()) {
            UserProfile user = userOpt.get();
            List<ConnectionRequest> asSender = connectionRepository.findBySenderAndStatus(user, "ACCEPTED");
            List<ConnectionRequest> asReceiver = connectionRepository.findByReceiverAndStatus(user, "ACCEPTED");
            
            List<ConnectionRequest> network = new ArrayList<>();
            network.addAll(asSender);
            network.addAll(asReceiver);
            return ResponseEntity.ok(network);
        }
        return ResponseEntity.badRequest().build();
    }
}
