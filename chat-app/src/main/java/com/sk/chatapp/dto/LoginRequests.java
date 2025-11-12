package com.sk.chatapp.dto;

import lombok.Data;

@Data
public class LoginRequests {
    private String usernameOrEmail;
    private String password;
}
