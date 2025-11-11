package com.sk.chatapp.controller;

import com.sk.chatapp.dto.LoginRequest;
import com.sk.chatapp.entity.User;
import com.sk.chatapp.service.JwtService;
import com.sk.chatapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String email = body.get("email");
        String password = body.get("password");
        String displayName = body.getOrDefault("displayName", username);

        User user = userService.register(username, email, password, displayName);
        return ResponseEntity.ok(Map.of("message", "User registered", "user", user.getUsername()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        return userService.findByUsernameOrEmail(request.getUsernameOrEmail())
                .filter(user -> userService.checkPassword(request.getPassword(), user.getPasswordHash()))
                .map(user -> {
                    String token = jwtService.generateToken(user.getUsername());
                    Map<String, Object> res = new HashMap<>();
                    res.put("accessToken", token);
                    res.put("user", user.getUsername());
                    return ResponseEntity.ok(res);
                })
                .orElse(ResponseEntity.status(401).body(Map.of("error", "Invalid credentials")));
    }
}
