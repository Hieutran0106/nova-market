package com.novamarket.backend.dto;

import lombok.Data;

public class AuthDTO {

    @Data
    public static class LoginRequest {
        private String identity; // email or phone
        private String password;
    }

    @Data
    public static class RegisterRequest {
        private String name;
        private String phone;
        private String email;
        private String password;
    }

    @Data
    public static class AuthResponse {
        private String message;
        private UserData user;

        public AuthResponse(String message, UserData user) {
            this.message = message;
            this.user = user;
        }

        @Data
        public static class UserData {
            private String name;
            private String email;
            private String phone;
            
            public UserData(String name, String email, String phone) {
                this.name = name;
                this.email = email;
                this.phone = phone;
            }
        }
    }
}
