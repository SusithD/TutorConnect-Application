package com.tutorconnect.service;

import com.tutorconnect.model.*;
import com.tutorconnect.repository.ChatRoomRepository;
import com.tutorconnect.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MessageService {
    
    private final MessageRepository messageRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final NotificationService notificationService;
    
    public List<ChatRoom> findChatRoomsByUserId(Long userId) {
        return chatRoomRepository.findByStudentIdOrTutorId(userId, userId);
    }
    
    public Optional<ChatRoom> findChatRoom(Long studentId, Long tutorId) {
        return chatRoomRepository.findByStudentIdAndTutorId(studentId, tutorId);
    }
    
    @Transactional
    public ChatRoom createChatRoom(Student student, Tutor tutor) {
        ChatRoom chatRoom = new ChatRoom(student, tutor);
        return chatRoomRepository.save(chatRoom);
    }
    
    public List<Message> findMessagesByChatRoomId(Long chatRoomId) {
        return messageRepository.findByChatRoomIdOrderBySentAtAsc(chatRoomId);
    }
    
    @Transactional
    public Message sendMessage(ChatRoom chatRoom, User sender, String content) {
        Message message = new Message(chatRoom, sender, content);
        Message savedMessage = messageRepository.save(message);
        
        // Update chat room's last message time
        chatRoom.setLastMessageAt(message.getSentAt());
        chatRoomRepository.save(chatRoom);
        
        // Determine recipient
        User recipient = sender.getId().equals(chatRoom.getStudent().getId()) 
            ? chatRoom.getTutor() 
            : chatRoom.getStudent();
        
        // Send notification
        notificationService.createNotification(
                recipient,
                "New Message",
                "You have a new message from " + sender.getFullName(),
                Notification.NotificationType.NEW_MESSAGE,
                "/messages/chat/" + chatRoom.getId());
        
        return savedMessage;
    }
    
    @Transactional
    public void markMessagesAsRead(Long chatRoomId, Long userId) {
        List<Message> unreadMessages = messageRepository.findByChatRoomIdAndSenderIdNotAndReadFalse(chatRoomId, userId);
        
        for (Message message : unreadMessages) {
            message.markAsRead();
        }
        
        messageRepository.saveAll(unreadMessages);
    }
    
    public int getUnreadMessageCount(Long userId) {
        List<ChatRoom> chatRooms = chatRoomRepository.findByStudentIdOrTutorId(userId, userId);
        int count = 0;
        
        for (ChatRoom chatRoom : chatRooms) {
            count += messageRepository.countByChatRoomIdAndSenderIdNotAndReadFalse(
                    chatRoom.getId(), userId);
        }
        
        return count;
    }
}