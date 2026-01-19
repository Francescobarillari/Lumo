package it.unical.service;

import it.unical.dto.chat.*;
import it.unical.exception.FieldException;
import it.unical.model.*;
import it.unical.dao.impl.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class ChatService {
    @Autowired
    private EventDao eventRepository;

    @Autowired
    private UserDao userRepository;

    @Autowired
    private EventChatDao chatRepository;

    @Autowired
    private ChatMessageDao messageRepository;

    @Autowired
    private ChatMuteDao muteRepository;

    @Autowired
    private ChatPollDao pollRepository;

    @Autowired
    private ChatPollVoteDao voteRepository;

    @Autowired
    private ChatStreamBroadcaster broadcaster;

    @Autowired
    private INotificationService notificationService;

    @Autowired
    private ContentFilterService contentFilterService;

    public SseEmitter connect(Long eventId, Long userId) {
        Event event = requireEvent(eventId);
        User user = requireUser(userId);
        assertUserCanAccess(event, user);
        ensureChat(event);
        return broadcaster.register(eventId, userId);
    }

    public List<ChatMessageResponse> getMessages(Long eventId, Long userId, int limit) {
        Event event = requireEvent(eventId);
        if (userId != null) {
            User user = requireUser(userId);
            assertUserCanAccess(event, user);
        }
        ensureChat(event);

        List<ChatMessage> messages = messageRepository.findByChat_Event_IdOrderByCreatedAtAsc(eventId);

        List<ChatMessageResponse> result = new ArrayList<>();
        for (ChatMessage message : messages) {
            result.add(toMessageResponse(message));
        }
        return result;
    }

    public ChatMessageResponse sendMessage(Long eventId, Long userId, String content) {
        Event event = requireEvent(eventId);
        User user = requireUser(userId);
        assertUserCanAccess(event, user);
        EventChat chat = ensureChat(event);

        if (isMuted(chat, userId)) {
            throw new RuntimeException("You are muted in this event chat.");
        }

        String trimmed = content == null ? "" : content.trim();
        if (trimmed.isEmpty()) {
            throw new RuntimeException("Message cannot be empty.");
        }
        if (contentFilterService.isBanned(trimmed)) {
            throw new FieldException("content", "Messaggio non consentito.");
        }

        ChatMessage message = new ChatMessage();
        message.setChat(chat);
        message.setSender(user);
        message.setContent(trimmed);
        message.setCreatedAt(LocalDateTime.now());
        ChatMessage saved = messageRepository.save(message);

        ChatMessageResponse response = toMessageResponse(saved);
        broadcaster.send(eventId, "message", response);
        notifyParticipants(event, user, response);
        return response;
    }

    public boolean getMuteStatus(Long eventId, Long userId) {
        Event event = requireEvent(eventId);
        User user = requireUser(userId);
        assertUserCanAccess(event, user);
        EventChat chat = ensureChat(event);
        return isMuted(chat, userId);
    }

    public List<ChatMuteResponse> getMutes(Long eventId, Long userId) {
        Event event = requireEvent(eventId);
        User requester = requireUser(userId);
        assertCreator(event, requester);
        EventChat chat = ensureChat(event);

        List<ChatMuteResponse> responses = new ArrayList<>();
        for (ChatMute mute : muteRepository.findByChat_Id(chat.getId())) {
            User mutedUser = mute.getUser();
            responses.add(new ChatMuteResponse(
                    mutedUser.getId(),
                    mutedUser.getName(),
                    mute.getCreatedAt(),
                    mute.getMutedBy() != null ? mute.getMutedBy().getId() : null,
                    mute.getReason()));
        }
        return responses;
    }

    public ChatMuteResponse muteUser(Long eventId, Long adminId, Long targetUserId, String reason) {
        Event event = requireEvent(eventId);
        User admin = requireUser(adminId);
        User target = requireUser(targetUserId);
        assertCreator(event, admin);
        assertUserCanAccess(event, target);
        EventChat chat = ensureChat(event);

        Optional<ChatMute> existing = muteRepository.findByChat_IdAndUser_Id(chat.getId(), targetUserId);
        if (existing.isPresent()) {
            return toMuteResponse(existing.get());
        }

        ChatMute mute = new ChatMute();
        mute.setChat(chat);
        mute.setUser(target);
        mute.setMutedBy(admin);
        mute.setReason(reason);
        mute.setCreatedAt(LocalDateTime.now());
        ChatMute saved = muteRepository.save(mute);

        ChatMuteResponse response = toMuteResponse(saved);
        broadcaster.send(eventId, "mute", Map.of("userId", targetUserId, "muted", true));
        return response;
    }

    public void unmuteUser(Long eventId, Long adminId, Long targetUserId) {
        Event event = requireEvent(eventId);
        User admin = requireUser(adminId);
        assertCreator(event, admin);
        EventChat chat = ensureChat(event);

        muteRepository.findByChat_IdAndUser_Id(chat.getId(), targetUserId)
                .ifPresent(muteRepository::delete);

        broadcaster.send(eventId, "mute", Map.of("userId", targetUserId, "muted", false));
    }

    public List<ChatPollResponse> getPolls(Long eventId, Long userId) {
        Event event = requireEvent(eventId);
        User user = requireUser(userId);
        assertUserCanAccess(event, user);
        EventChat chat = ensureChat(event);

        List<ChatPoll> polls = pollRepository.findByChat_IdOrderByCreatedAtDesc(chat.getId());
        List<ChatPollResponse> responses = new ArrayList<>();
        for (ChatPoll poll : polls) {
            closeIfExpired(poll);
            responses.add(toPollResponse(poll));
        }
        return responses;
    }

    public ChatPollResponse createPoll(Long eventId, Long adminId, String question, List<String> options,
                                       LocalDateTime endsAt) {
        Event event = requireEvent(eventId);
        User admin = requireUser(adminId);
        assertUserCanAccess(event, admin);
        EventChat chat = ensureChat(event);

        String trimmedQuestion = question == null ? "" : question.trim();
        if (trimmedQuestion.isEmpty()) {
            throw new RuntimeException("Question cannot be empty.");
        }
        if (options == null || options.size() < 2) {
            throw new RuntimeException("Provide at least two options.");
        }
        if (endsAt == null || endsAt.isBefore(LocalDateTime.now())) {
            throw new RuntimeException("End date must be in the future.");
        }

        List<String> cleanedOptions = new ArrayList<>();
        for (String option : options) {
            String trimmed = option == null ? "" : option.trim();
            if (!trimmed.isEmpty()) {
                cleanedOptions.add(trimmed);
            }
        }
        if (cleanedOptions.size() < 2) {
            throw new RuntimeException("Provide at least two non-empty options.");
        }

        ChatPoll poll = new ChatPoll();
        poll.setChat(chat);
        poll.setQuestion(trimmedQuestion);
        poll.setCreatedAt(LocalDateTime.now());
        poll.setEndsAt(endsAt);
        poll.setIsClosed(false);
        poll.setCreatedBy(admin);

        for (String optionText : cleanedOptions) {
            ChatPollOption option = new ChatPollOption();
            option.setPoll(poll);
            option.setText(optionText);
            poll.getOptions().add(option);
        }

        ChatPoll saved = pollRepository.save(poll);
        ChatPollResponse response = toPollResponse(saved);
        broadcaster.send(eventId, "poll", response);
        return response;
    }

    public ChatPollResponse votePoll(Long eventId, Long userId, Long pollId, List<Long> optionIds) {
        Event event = requireEvent(eventId);
        User user = requireUser(userId);
        assertUserCanAccess(event, user);
        EventChat chat = ensureChat(event);

        ChatPoll poll = pollRepository.findByIdAndChat_Id(pollId, chat.getId())
                .orElseThrow(() -> new RuntimeException("Poll not found"));
        closeIfExpired(poll);
        if (poll.getIsClosed()) {
            throw new RuntimeException("Poll is closed.");
        }

        List<Long> selectedIds = optionIds == null ? new ArrayList<>() : optionIds;
        List<ChatPollOption> pollOptions = poll.getOptions() != null ? poll.getOptions() : new ArrayList<>();
        Map<Long, ChatPollOption> optionMap = new HashMap<>();
        for (ChatPollOption option : pollOptions) {
            optionMap.put(option.getId(), option);
        }

        for (Long id : selectedIds) {
            if (!optionMap.containsKey(id)) {
                throw new RuntimeException("Invalid poll option.");
            }
        }

        voteRepository.deleteByPoll_IdAndUser_Id(poll.getId(), userId);
        if (poll.getVotes() != null) {
            poll.getVotes().removeIf(vote -> vote.getUser() != null && vote.getUser().getId().equals(userId));
        } else {
            poll.setVotes(new ArrayList<>());
        }

        for (Long optionId : selectedIds) {
            ChatPollVote vote = new ChatPollVote();
            vote.setPoll(poll);
            vote.setOption(optionMap.get(optionId));
            vote.setUser(user);
            vote.setCreatedAt(LocalDateTime.now());
            poll.getVotes().add(vote);
        }

        ChatPoll saved = pollRepository.save(poll);
        ChatPollResponse response = toPollResponse(saved);
        broadcaster.send(eventId, "poll-vote", response);
        return response;
    }

    public ChatPollResponse closePoll(Long eventId, Long adminId, Long pollId) {
        Event event = requireEvent(eventId);
        User admin = requireUser(adminId);
        assertCreator(event, admin);
        EventChat chat = ensureChat(event);

        ChatPoll poll = pollRepository.findByIdAndChat_Id(pollId, chat.getId())
                .orElseThrow(() -> new RuntimeException("Poll not found"));
        poll.setIsClosed(true);
        ChatPoll saved = pollRepository.save(poll);
        ChatPollResponse response = toPollResponse(saved);
        broadcaster.send(eventId, "poll-close", response);
        return response;
    }

    private Event requireEvent(Long eventId) {
        return eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
    }

    private User requireUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private void assertUserCanAccess(Event event, User user) {
        boolean isCreator = event.getCreatorId() != null && event.getCreatorId().equals(user.getId());
        boolean isParticipant = user.getParticipatingEvents().contains(event);
        if (!isCreator && !isParticipant) {
            throw new RuntimeException("User not allowed in this chat.");
        }
    }

    private void assertCreator(Event event, User user) {
        if (event.getCreatorId() == null || !event.getCreatorId().equals(user.getId())) {
            throw new RuntimeException("Only the creator can manage this.");
        }
    }

    private EventChat ensureChat(Event event) {
        Optional<EventChat> existing = chatRepository.findByEvent_Id(event.getId());
        if (existing.isPresent()) {
            return existing.get();
        }
        EventChat chat = new EventChat();
        chat.setEvent(event);
        chat.setCreatedAt(LocalDateTime.now());
        return chatRepository.save(chat);
    }

    private boolean isMuted(EventChat chat, Long userId) {
        return muteRepository.findByChat_IdAndUser_Id(chat.getId(), userId).isPresent();
    }

    private void closeIfExpired(ChatPoll poll) {
        if (!poll.getIsClosed() && poll.getEndsAt() != null && poll.getEndsAt().isBefore(LocalDateTime.now())) {
            poll.setIsClosed(true);
            pollRepository.save(poll);
        }
    }

    private ChatMessageResponse toMessageResponse(ChatMessage message) {
        User sender = message.getSender();
        return new ChatMessageResponse(
                message.getId(),
                message.getContent(),
                message.getCreatedAt(),
                sender != null ? sender.getId() : null,
                sender != null ? sender.getName() : "Unknown",
                sender != null ? sender.getProfileImage() : null);
    }

    private ChatMuteResponse toMuteResponse(ChatMute mute) {
        User mutedUser = mute.getUser();
        return new ChatMuteResponse(
                mutedUser.getId(),
                mutedUser.getName(),
                mute.getCreatedAt(),
                mute.getMutedBy() != null ? mute.getMutedBy().getId() : null,
                mute.getReason());
    }

    private ChatPollResponse toPollResponse(ChatPoll poll) {
        Map<Long, List<ChatPollVoterResponse>> votersByOption = new HashMap<>();
        List<ChatPollVote> votes = poll.getVotes() != null ? poll.getVotes() : new ArrayList<>();
        for (ChatPollVote vote : votes) {
            ChatPollOption option = vote.getOption();
            User voter = vote.getUser();
            if (option == null || voter == null) {
                continue;
            }
            votersByOption.computeIfAbsent(option.getId(), key -> new ArrayList<>()).add(
                    new ChatPollVoterResponse(voter.getId(), voter.getName(), voter.getProfileImage()));
        }

        List<ChatPollOptionResponse> optionResponses = new ArrayList<>();
        List<ChatPollOption> options = poll.getOptions() != null ? poll.getOptions() : new ArrayList<>();
        for (ChatPollOption option : options) {
            List<ChatPollVoterResponse> voters = votersByOption.getOrDefault(option.getId(),
                    new ArrayList<>());
            optionResponses.add(new ChatPollOptionResponse(option.getId(), option.getText(), voters));
        }

        return new ChatPollResponse(
                poll.getId(),
                poll.getQuestion(),
                poll.getCreatedAt(),
                poll.getEndsAt(),
                poll.getIsClosed(),
                optionResponses);
    }

    private void notifyParticipants(Event event, User sender, ChatMessageResponse message) {
        if (event.getParticipants() == null) {
            return;
        }
        String preview = message.content();
        if (preview.length() > 120) {
            preview = preview.substring(0, 120) + "...";
        }
        String title = "New message in " + event.getTitle();
        for (User participant : event.getParticipants()) {
            if (participant.getId().equals(sender.getId())) {
                continue;
            }
            if (broadcaster.isUserActive(event.getId(), participant.getId())) {
                continue;
            }
            notificationService.createRichNotification(
                    participant.getId(),
                    title,
                    sender.getName() + ": " + preview,
                    "CHAT_MESSAGE",
                    event.getId(),
                    sender.getId());
        }
    }
}

