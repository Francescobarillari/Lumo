package it.unical.dto.chat;

import java.util.List;

public record ChatPollOptionResponse(Long id, String text, List<ChatPollVoterResponse> voters) {
}
