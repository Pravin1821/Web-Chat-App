package com.sk.chatapp.service;

import com.sk.chatapp.entity.User;
import com.sk.chatapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public User register(String username, String email, String password, String displayName) {
        String hashed = passwordEncoder.encode(password);
        User user = new User(username, email, hashed, displayName);
        return userRepository.save(user);
    }

    public Optional<User> findByUsernameOrEmail(String usernameOrEmail) {
        Optional<User> userOpt = userRepository.findByUsername(usernameOrEmail);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(usernameOrEmail);
        }
        return userOpt;
    }

    public boolean checkPassword(String rawPassword, String hashed) {
        return passwordEncoder.matches(rawPassword, hashed);
    }
}
