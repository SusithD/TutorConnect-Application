package com.tutorconnect.repository;

import com.tutorconnect.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByChatRoomIdOrderBySentAtAsc(Long chatRoomId);
    List<Message> findByChatRoomIdAndSenderIdNotAndReadFalse(Long chatRoomId, Long senderId);
    int countByChatRoomIdAndSenderIdNotAndReadFalse(Long chatRoomId, Long senderId);
}