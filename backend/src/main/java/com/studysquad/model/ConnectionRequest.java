package com.studysquad.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "connection_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConnectionRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sender_id", nullable = false)
    private UserProfile sender;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "receiver_id", nullable = false)
    private UserProfile receiver;

    private String status; // "PENDING", "ACCEPTED", "REJECTED"
    
    private String message;
    
    // Virtual room ID generated when ACCEPTED
    private String meetRoomId; 
    
    // Agreed schedule
    private String scheduledTime;

    private LocalDateTime createdAt = LocalDateTime.now();
}
