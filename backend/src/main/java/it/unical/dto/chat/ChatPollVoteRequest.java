package it.unical.dto.chat;

import java.util.List;

public record ChatPollVoteRequest(List<Long> optionIds) {
}
