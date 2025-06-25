package com.myhomego.user.dto;

import lombok.*;

import java.time.LocalDateTime;

public class UserDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        private String userId;
        private String userEmail;
        private String userPwd;
        private String userName;
        private String phone;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SignUpRequest {
        private String userId;
        private String userEmail;
        private String userPwd;
        private String userName;
        private String phone;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRequest {
        private String userName;
        private String phone;
        private String userPwd;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        private String userId;
        private String userPwd;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Long id;
        private String userId;
        private String userEmail;
        private String userName;
        private String userPwd;
        private String phone;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
} 