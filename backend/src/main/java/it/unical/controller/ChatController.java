package it.unical.controller;

import it.unical.dto.chat.*;
import it.unical.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events/{eventId}/chat")
public class ChatController {
    @Autowired
    private ChatService chatService;

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter stream(@PathVariable Long eventId, @RequestParam Long userId) {
        return chatService.connect(eventId, userId);
    }

    @GetMapping("/messages")
    public List<ChatMessageResponse> getMessages(@PathVariable Long eventId,
                                                 @RequestParam(required = false) Long userId,
                                                 @RequestParam(defaultValue = "100") int limit) {
        return chatService.getMessages(eventId, userId, limit);
    }

    @PostMapping("/messages")
    public ChatMessageResponse sendMessage(@PathVariable Long eventId,
                                           @RequestParam Long userId,
                                           @RequestBody ChatMessageRequest request) {
        return chatService.sendMessage(eventId, userId, request.content());
    }

    @GetMapping("/mute-status")
    public Map<String, Boolean> getMuteStatus(@PathVariable Long eventId, @RequestParam Long userId) {
        boolean muted = chatService.getMuteStatus(eventId, userId);
        return Map.of("muted", muted);
    }

    @GetMapping("/mutes")
    public List<ChatMuteResponse> getMutes(@PathVariable Long eventId, @RequestParam Long userId) {
        return chatService.getMutes(eventId, userId);
    }

    @PostMapping("/mutes")
    public ChatMuteResponse muteUser(@PathVariable Long eventId,
                                     @RequestParam Long userId,
                                     @RequestBody ChatMuteRequest request) {
        return chatService.muteUser(eventId, userId, request.targetUserId(), request.reason());
    }

    @DeleteMapping("/mutes/{targetUserId}")
    public ResponseEntity<Void> unmuteUser(@PathVariable Long eventId,
                                           @RequestParam Long userId,
                                           @PathVariable Long targetUserId) {
        chatService.unmuteUser(eventId, userId, targetUserId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/polls")
    public List<ChatPollResponse> getPolls(@PathVariable Long eventId, @RequestParam Long userId) {
        return chatService.getPolls(eventId, userId);
    }

    @PostMapping("/polls")
    public ChatPollResponse createPoll(@PathVariable Long eventId,
                                       @RequestParam Long userId,
                                       @RequestBody ChatPollCreateRequest request) {
        String endsAtRaw = request.endsAt();
        LocalDateTime endsAt = null;
        if (endsAtRaw != null && !endsAtRaw.isBlank()) {
            endsAt = LocalDateTime.parse(endsAtRaw);
        }
        return chatService.createPoll(eventId, userId, request.question(), request.options(), endsAt);
    }

    @PostMapping("/polls/open")
    public ChatPollResponse createPollOpen(@PathVariable Long eventId,
                                           @RequestParam Long userId,
                                           @RequestBody ChatPollCreateRequest request) {
        String endsAtRaw = request.endsAt();
        LocalDateTime endsAt = null;
        if (endsAtRaw != null && !endsAtRaw.isBlank()) {
            endsAt = LocalDateTime.parse(endsAtRaw);
        }
        return chatService.createPoll(eventId, userId, request.question(), request.options(), endsAt);
    }

    @PostMapping("/polls/{pollId}/votes")
    public ChatPollResponse votePoll(@PathVariable Long eventId,
                                     @PathVariable Long pollId,
                                     @RequestParam Long userId,
                                     @RequestBody ChatPollVoteRequest request) {
        return chatService.votePoll(eventId, userId, pollId, request.optionIds());
    }

    @PostMapping("/polls/{pollId}/close")
    public ChatPollResponse closePoll(@PathVariable Long eventId,
                                      @PathVariable Long pollId,
                                      @RequestParam Long userId) {
        return chatService.closePoll(eventId, userId, pollId);
    }
}
