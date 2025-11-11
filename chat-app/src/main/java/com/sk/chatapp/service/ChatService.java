package com.sk.chatapp.service;

import com.sk.chatapp.dto.ChatMessageDto;
import com.sk.chatapp.entity.Message;
import com.sk.chatapp.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class ChatService {

    @Autowired
    private MessageRepository messageRepository;

    public void saveRoomMessage(ChatMessageDto dto) {
        Message message = Message.builder()
                .sender(dto.getSender())
                .roomId(dto.getRoomId())
                .content(dto.getContent())
                .timestamp(LocalDateTime.now())
                .build();
        messageRepository.save(message);
    }

    public void savePrivateMessage(ChatMessageDto dto) {
        Message message = Message.builder()
                .sender(dto.getSender())
                .receiver(dto.getTargetUser())
                .content(dto.getContent())
                .timestamp(LocalDateTime.now())
                .build();
        messageRepository.save(message);
    }
}

