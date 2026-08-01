package com.novamarket.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class AiGenerateRequest {
    private String seed;
    private UserContext userContext;

    @Data
    public static class UserContext {
        private String name;
        private List<String> cart;
    }
}
