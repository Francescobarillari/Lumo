package it.unical.controller;

import it.unical.model.Event;
import it.unical.model.User;
import it.unical.repository.UserRepository;
import it.unical.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:4200")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventService eventService;

    // View All Users with their pending events
    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getUsersWithPendingEvents() {
        List<User> users = userRepository.findAll();
        List<Event> allPending = eventService.getPendingEvents();

        List<Map<String, Object>> result = new ArrayList<>();

        for (User user : users) {
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getId());
            userMap.put("name", user.getName());
            userMap.put("email", user.getEmail());
            userMap.put("profileImage", user.getProfileImage());
            userMap.put("isAdmin", user.getIsAdmin());

            // Filter pending events created by this user
            // Problem: Event does not store creator explicitly in simplified model?
            // User.participatingEvents store participation.
            // Usually the creator is the first participant? Or we scan participations.
            // Assuming for now we list ALL pending events under a "General Requests" or
            // matching logic if possible.
            // If we lack 'creator' relation, we can't key them by user accurately unless we
            // check who is participating in the pending event?
            // "Participating" in a Pending event = Creator (usually).

            List<Event> userPending = allPending.stream()
                    .filter(e -> user.getParticipatingEvents().stream().anyMatch(pe -> pe.getId().equals(e.getId())))
                    .collect(Collectors.toList());

            // Only add if user has pending events OR we want to show all users
            userMap.put("pendingEvents", userPending);

            result.add(userMap);
        }

        return ResponseEntity.ok(result);
    }

    @PostMapping("/events/{id}/approve")
    public ResponseEntity<Event> approveEvent(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.approveEvent(id));
    }

    @PostMapping("/events/{id}/reject")
    public ResponseEntity<Void> rejectEvent(@PathVariable Long id) {
        eventService.rejectEvent(id);
        return ResponseEntity.ok().build();
    }
}
