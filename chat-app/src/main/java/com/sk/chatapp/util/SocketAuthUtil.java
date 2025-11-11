package com.sk.chatapp.util;

import com.corundumstudio.socketio.HandshakeData;
import com.corundumstudio.socketio.SocketIOClient;
import com.sk.chatapp.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class SocketAuthUtil {

    @Autowired
    private JwtService jwtService;

    /**
     * Extract JWT token from the socket handshake (query params)
     * Example: ws://localhost:8080/socket.io/?token=JWT_HERE
     */
    public String extractToken(HandshakeData handshakeData) {
        return handshakeData.getSingleUrlParam("token");
    }

    /**
     * Validate and extract username from the token
     */
    public String getUsernameFromHandshake(HandshakeData handshakeData) {
        String token = extractToken(handshakeData);
        if (token != null && jwtService.validateToken(token)) {
            return jwtService.extractUsername(token);
        }
        return null;
    }

    /**
     * Helper for runtime token validation if needed during messages
     */
    public boolean isAuthenticated(SocketIOClient client) {
        String username = client.get("username");
        return username != null;
    }
}

