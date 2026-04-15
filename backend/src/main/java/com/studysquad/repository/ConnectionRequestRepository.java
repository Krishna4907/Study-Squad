package com.studysquad.repository;

import com.studysquad.model.ConnectionRequest;
import com.studysquad.model.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConnectionRequestRepository extends JpaRepository<ConnectionRequest, Long> {
    List<ConnectionRequest> findByReceiverAndStatus(UserProfile receiver, String status);
    List<ConnectionRequest> findBySenderAndStatus(UserProfile sender, String status);
    Optional<ConnectionRequest> findBySenderAndReceiver(UserProfile sender, UserProfile receiver);
}
