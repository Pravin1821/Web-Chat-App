package com.sk.chatapp.socket;

import com.corundumstudio.socketio.*;
import com.sk.chatapp.dto.ChatMessageDto;
import com.sk.chatapp.service.ChatService;
import com.sk.chatapp.util.SocketAuthUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class SocketServer {

    @Autowired
    private SocketIOServer server;

    @Autowired
    private SocketAuthUtil socketAuthUtil;

    @Autowired
    private ChatService chatService;

    // Store online users (username -> socket)
    private final Map<String, SocketIOClient> onlineUsers = new ConcurrentHashMap<>();

    @PostConstruct
    public void startServer() {
        // Listen for connection
        server.addConnectListener(client -> {
            String username = socketAuthUtil.getUsernameFromHandshake(client.getHandshakeData());
            if (username == null) {
                client.disconnect();
                return;
            }

            client.set("username", username);
            onlineUsers.put(username, client);
            broadcastOnlineUsers();

            System.out.println("✅ " + username + " connected");
        });

        server.addDisconnectListener(client -> {
            String username = client.get("username");
            if (username != null) {
                onlineUsers.remove(username);
                broadcastOnlineUsers();
                System.out.println("❌ " + username + " disconnected");
            }
        });

        server.addEventListener("joinRoom", String.class, (client, roomId, ackSender) -> {
            client.joinRoom(roomId);
            server.getRoomOperations(roomId).sendEvent("systemMessage", username(client) + " joined " + roomId);
            System.out.println(username(client) + " joined " + roomId);
        });

        server.addEventListener("leaveRoom", String.class, (client, roomId, ackSender) -> {
            client.leaveRoom(roomId);
            server.getRoomOperations(roomId).sendEvent("systemMessage", username(client) + " left " + roomId);
            System.out.println(username(client) + " left " + roomId);
        });

        server.addEventListener("sendMessage", ChatMessageDto.class, (client, data, ackSender) -> {
            chatService.saveRoomMessage(data);
            server.getRoomOperations(data.getRoomId()).sendEvent("newMessage", data);
        });

        server.addEventListener("sendPrivate", ChatMessageDto.class, (client, data, ackSender) -> {
            chatService.savePrivateMessage(data);
            String target = data.getTargetUser();

            if (onlineUsers.containsKey(target)) {
                onlineUsers.get(target).sendEvent("privateMessage", data);
            }
        });

        server.start();
        System.out.println("🚀 Socket.IO server started on port 8080");
    }

    private String username(SocketIOClient client) {
        return client.get("username");
    }

    private void broadcastOnlineUsers() {
        List<String> users = new ArrayList<>(onlineUsers.keySet());
        server.getBroadcastOperations().sendEvent("onlineUsers", users);
    }
}

