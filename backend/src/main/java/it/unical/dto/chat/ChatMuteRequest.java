package it.unical.dto.chat;

public record ChatMuteRequest(Long targetUserId, String reason) {
}
