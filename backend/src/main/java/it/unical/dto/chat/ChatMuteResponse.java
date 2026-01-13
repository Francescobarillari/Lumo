package it.unical.dto.chat;

import java.time.LocalDateTime;

public record ChatMuteResponse(
        Long userId,
        String userName,
        LocalDateTime mutedAt,
        Long mutedById,
        String reason) {
}
