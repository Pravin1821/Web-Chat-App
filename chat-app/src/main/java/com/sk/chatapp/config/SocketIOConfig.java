package com.sk.chatapp.config;

import com.corundumstudio.socketio.Configuration;
import com.corundumstudio.socketio.SocketIOServer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;

@org.springframework.context.annotation.Configuration
public class SocketIOConfig {

    // Read from application.yml, with defaults
    @Value("${socket-server.host:0.0.0.0}")
    private String host;

    @Value("${socket-server.port:9092}")
    private int port;

    @Bean
    public SocketIOServer socketIOServer() {
        Configuration config = new Configuration();
        config.setHostname(host);
        config.setPort(port);
        config.setOrigin("*"); // allow all origins for development
        return new SocketIOServer(config);
    }

    // Auto-start socket server when Spring Boot starts
    @Bean
    public CommandLineRunner runner(SocketIOServer server) {
        return args -> {
            server.start();
            System.out.println("✅ Socket.IO server started on port " + port);
        };
    }
}
