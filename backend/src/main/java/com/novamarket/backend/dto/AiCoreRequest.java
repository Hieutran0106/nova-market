package com.novamarket.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class AiCoreRequest {
    @JsonProperty("system_prompt")
    private String systemPrompt;

    @JsonProperty("user_message")
    private String userMessage;

    @JsonProperty("max_tokens")
    private int maxTokens = 500;
}
