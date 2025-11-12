package com.sk.chatapp.service;

import com.sk.chatapp.dto.ChatMessageDto;
import com.sk.chatapp.entity.Message;
import com.sk.chatapp.repository.MessageRepository;
import com.sk.chatapp.entity.User;
import com.sk.chatapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class ChatService {

    @Autowired
    private MessageRepository messageRepository;

    public void saveRoomMessage(ChatMessageDto dto, User sender) {
        Message message = Message.builder()
                .roomId(dto.getRoomId())
                .sender(sender)
                .content(dto.getContent())
                .isPrivate(false)
                .createdAt(Instant.now())
                .build();

        messageRepository.save(message);
    }

    public void savePrivateMessage(ChatMessageDto dto, User sender) {
        Message message = Message.builder()
                .sender(sender)
                .targetUser(dto.getTargetUser())
                .content(dto.getContent())
                .isPrivate(true)
                .createdAt(Instant.now())
                .build();

        messageRepository.save(message);
    }
}
