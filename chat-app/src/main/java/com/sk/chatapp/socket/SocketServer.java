package com.sk.chatapp.socket;

import com.corundumstudio.socketio.AckRequest;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.ConnectListener;
import com.corundumstudio.socketio.listener.DataListener;
import com.corundumstudio.socketio.listener.DisconnectListener;
import com.sk.chatapp.dto.ChatMessageDto;
import com.sk.chatapp.entity.User;
import com.sk.chatapp.repository.UserRepository;
import com.sk.chatapp.service.ChatService;
import com.sk.chatapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class SocketServer {

    private final SocketIOServer server;
    private final UserService userService;
    private final ChatService chatService;

    // Keep track of connected users
    private final Map<String, SocketIOClient> onlineUsers = new ConcurrentHashMap<>();

    @Autowired
    public SocketServer(SocketIOServer server, UserService userService, ChatService chatService) {
        this.server = server;
        this.userService = userService;
        this.chatService = chatService;
        setupListeners();
    }

    private void setupListeners() {

        // --- On Connect ---
        server.addConnectListener(onConnected());
        // --- On Disconnect ---
        server.addDisconnectListener(onDisconnected());

        // --- On Join Room ---
        server.addEventListener("joinRoom", String.class, (client, roomId, ackRequest) -> {
            client.joinRoom(roomId);
            server.getRoomOperations(roomId)
                    .sendEvent("userJoined", client.getSessionId().toString() + " joined " + roomId);
        });

        // --- On Send Message to Room ---
        server.addEventListener("sendMessage", ChatMessageDto.class, onSendMessage());

        // --- On Private Message ---
        server.addEventListener("sendPrivate", ChatMessageDto.class, onPrivateMessage());
    }

    private ConnectListener onConnected() {
        return client -> {
            String username = client.getHandshakeData().getSingleUrlParam("username");
            if (username != null) {
                onlineUsers.put(username, client);
                System.out.println("✅ User connected: " + username);
                // Broadcast updated online users list to all clients
                broadcastOnlineUsers();
            }
        };
    }

    private DisconnectListener onDisconnected() {
        return client -> {
            String username = client.getHandshakeData().getSingleUrlParam("username");
            if (username != null) {
                onlineUsers.remove(username);
                System.out.println("❌ User disconnected: " + username);
                // Broadcast updated online users list to all clients
                broadcastOnlineUsers();
            }
        };
    }

    private DataListener<ChatMessageDto> onSendMessage() {
        return (client, data, ackRequest) -> {
            String roomId = data.getRoomId();
            String senderUsername = data.getSender();

            // Find sender from DB
            User sender = userService.findByUsernameOrEmail(senderUsername).orElse(null);
            if (sender == null) {
                System.out.println("⚠️ Sender not found: " + senderUsername);
                return;
            }

            // Save message
            chatService.saveRoomMessage(data, sender);

            // Broadcast to room
            server.getRoomOperations(roomId).sendEvent("newMessage", data);
        };
    }

    private DataListener<ChatMessageDto> onPrivateMessage() {
        return (client, data, ackRequest) -> {
            String targetUsername = data.getTargetUser();
            String senderUsername = data.getSender();

            User sender = userService.findByUsernameOrEmail(senderUsername).orElse(null);
            if (sender == null) {
                System.out.println("⚠️ Sender not found: " + senderUsername);
                return;
            }

            // Save private message
            chatService.savePrivateMessage(data, sender);

            // Emit to target user if online
            SocketIOClient targetClient = onlineUsers.get(targetUsername);
            if (targetClient != null) {
                targetClient.sendEvent("privateMessage", data);
            } else {
                System.out.println("⚠️ Target user not online: " + targetUsername);
            }
        };
    }

    public void start() {
        server.start();
        System.out.println("🚀 Socket.IO server started on port " + server.getConfiguration().getPort());
    }

    public void stop() {
        server.stop();
        System.out.println("🛑 Socket.IO server stopped");
    }

    private void broadcastOnlineUsers() {
        // Send list of online usernames to all connected clients
        server.getBroadcastOperations().sendEvent("onlineUsers", onlineUsers.keySet());
    }
}
