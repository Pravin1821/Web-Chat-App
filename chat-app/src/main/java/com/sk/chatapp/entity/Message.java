package com.sk.chatapp.entity;

import jakarta.persistence.*;
import lombok.Builder;

import java.time.Instant;

@Entity
@Table(name = "messages", indexes = {
        @Index(columnList = "room_id"),
        @Index(columnList = "target_user")
})
@Builder
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "room_id", length = 120)
    private String roomId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id")
    private User sender;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "is_private", nullable = false)
    private boolean isPrivate = false;

    @Column(name = "target_user", length = 100)
    private String targetUser;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    public Message() { }

    // convenience constructors
    public Message(String roomId, User sender, String content) {
        this.roomId = roomId;
        this.sender = sender;
        this.content = content;
        this.isPrivate = false;
        this.createdAt = Instant.now();
    }

    public Message(User sender, String targetUser, String content) {
        this.sender = sender;
        this.targetUser = targetUser;
        this.content = content;
        this.isPrivate = true;
        this.createdAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public String getRoomId() {
        return roomId;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }

    public User getSender() {
        return sender;
    }

    public void setSender(User sender) {
        this.sender = sender;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public boolean isPrivate() {
        return isPrivate;
    }

    public void setPrivate(boolean aPrivate) {
        isPrivate = aPrivate;
    }

    public String getTargetUser() {
        return targetUser;
    }

    public void setTargetUser(String targetUser) {
        this.targetUser = targetUser;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
