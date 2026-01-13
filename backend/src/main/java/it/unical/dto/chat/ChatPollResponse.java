package it.unical.dto.chat;

import java.time.LocalDateTime;
import java.util.List;

public record ChatPollResponse(
        Long id,
        String question,
        LocalDateTime createdAt,
        LocalDateTime endsAt,
        boolean closed,
        List<ChatPollOptionResponse> options) {
}
