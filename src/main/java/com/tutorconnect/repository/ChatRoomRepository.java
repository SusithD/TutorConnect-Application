package com.tutorconnect.repository;

import com.tutorconnect.model.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    List<ChatRoom> findByStudentIdOrTutorId(Long studentId, Long tutorId);
    Optional<ChatRoom> findByStudentIdAndTutorId(Long studentId, Long tutorId);
}