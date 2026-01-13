package it.unical.service;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class ChatStreamBroadcaster {
    private final ConcurrentHashMap<Long, CopyOnWriteArrayList<SseEmitter>> emittersByEvent = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<Long, ConcurrentHashMap<Long, Integer>> activeUsersByEvent = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<SseEmitter, Long> emitterUsers = new ConcurrentHashMap<>();

    public SseEmitter register(Long eventId, Long userId) {
        SseEmitter emitter = new SseEmitter(0L);
        emittersByEvent.computeIfAbsent(eventId, key -> new CopyOnWriteArrayList<>()).add(emitter);
        activeUsersByEvent.computeIfAbsent(eventId, key -> new ConcurrentHashMap<>())
                .merge(userId, 1, Integer::sum);
        emitterUsers.put(emitter, userId);

        emitter.onCompletion(() -> removeEmitter(eventId, userId, emitter));
        emitter.onTimeout(() -> removeEmitter(eventId, userId, emitter));
        emitter.onError((ex) -> removeEmitter(eventId, userId, emitter));

        return emitter;
    }

    public void send(Long eventId, String eventName, Object payload) {
        List<SseEmitter> emitters = emittersByEvent.get(eventId);
        if (emitters == null || emitters.isEmpty()) {
            return;
        }

        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event()
                        .name(eventName)
                        .data(payload, MediaType.APPLICATION_JSON));
            } catch (IOException ex) {
                Long userId = emitterUsers.get(emitter);
                if (userId != null) {
                    removeEmitter(eventId, userId, emitter);
                } else {
                    removeEmitter(eventId, null, emitter);
                }
            }
        }
    }

    public boolean isUserActive(Long eventId, Long userId) {
        ConcurrentHashMap<Long, Integer> users = activeUsersByEvent.get(eventId);
        if (users == null) {
            return false;
        }
        return users.getOrDefault(userId, 0) > 0;
    }

    private void removeEmitter(Long eventId, Long userId, SseEmitter emitter) {
        List<SseEmitter> emitters = emittersByEvent.get(eventId);
        if (emitters != null) {
            emitters.remove(emitter);
        }
        emitterUsers.remove(emitter);
        if (userId != null) {
            ConcurrentHashMap<Long, Integer> users = activeUsersByEvent.get(eventId);
            if (users != null) {
                users.computeIfPresent(userId, (key, count) -> count <= 1 ? null : count - 1);
            }
        }
    }
}
