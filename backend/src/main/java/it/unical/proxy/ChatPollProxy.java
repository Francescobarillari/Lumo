package it.unical.proxy;

import it.unical.model.ChatPoll;
import it.unical.model.ChatPollOption;
import it.unical.model.ChatPollVote;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class ChatPollProxy extends ChatPoll {
    public ChatPollProxy() {
    }

    public ChatPollProxy(javax.sql.DataSource ignored) {
        // Kept for backward compatibility with existing constructors in DAOs/proxies.
    }

    @Override
    public void setOptions(List<ChatPollOption> options) {
        List<ChatPollOption> sanitized = new ArrayList<>();
        Map<Long, ChatPollOption> byId = new LinkedHashMap<>();
        Set<String> textKeys = new LinkedHashSet<>();
        if (options != null) {
            for (ChatPollOption option : options) {
                if (option == null) {
                    continue;
                }
                if (option.getPoll() != null && !sameEntity(option.getPoll().getId(), getId())) {
                    throw new IllegalArgumentException("ChatPollOption linked to a different poll");
                }
                option.setPoll(this);
                if (option.getId() != null) {
                    byId.putIfAbsent(option.getId(), option);
                } else {
                    String text = option.getText() == null ? "" : option.getText().trim().toLowerCase();
                    if (text.isEmpty() || textKeys.contains(text)) {
                        continue;
                    }
                    textKeys.add(text);
                    sanitized.add(option);
                }
            }
        }
        sanitized.addAll(byId.values());
        super.setOptions(sanitized);
    }

    @Override
    public void setVotes(List<ChatPollVote> votes) {
        List<ChatPollVote> sanitized = new ArrayList<>();
        Set<String> seenKeys = new LinkedHashSet<>();
        if (votes != null) {
            for (ChatPollVote vote : votes) {
                if (vote == null) {
                    continue;
                }
                if (vote.getPoll() != null && !sameEntity(vote.getPoll().getId(), getId())) {
                    throw new IllegalArgumentException("ChatPollVote linked to a different poll");
                }
                vote.setPoll(this);

                String key = vote.getId() != null
                        ? "id:" + vote.getId()
                        : "u:" + (vote.getUser() != null ? vote.getUser().getId() : "null")
                        + "|o:" + (vote.getOption() != null ? vote.getOption().getId() : "null");
                if (seenKeys.contains(key)) {
                    continue;
                }
                seenKeys.add(key);
                sanitized.add(vote);
            }
        }
        super.setVotes(sanitized);
    }

    private boolean sameEntity(Long leftId, Long rightId) {
        return leftId == null || rightId == null || leftId.equals(rightId);
    }
}
