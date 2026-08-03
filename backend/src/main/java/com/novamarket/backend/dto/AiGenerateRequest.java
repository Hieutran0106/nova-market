package com.novamarket.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class AiGenerateRequest {
    private String seed;
    private UserContext userContext;
    private List<ChatMessage> history;

    @Data
    public static class UserContext {
        private String name;
        private String email;
        private String phone;
        private List<String> cart;
        private String profile;
    }

    @Data
    public static class ChatMessage {
        private String role;
        private String text;
    }
}
