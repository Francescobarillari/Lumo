package it.unical.dto.chat;

import java.util.List;

public record ChatPollCreateRequest(String question, List<String> options, String endsAt) {
}
