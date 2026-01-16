package it.unical.controller;

import it.unical.model.Event;
import it.unical.model.User;
import it.unical.repository.UserRepository;
import it.unical.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:4200")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventService eventService;

    @GetMapping("/events")
    public List<Event> getAllEvents() {
        return eventService.getAllEventsForAdmin();
    }

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

            List<Event> userPending = allPending.stream()
                    .filter(e -> user.getParticipatingEvents().stream().anyMatch(pe -> pe.getId().equals(e.getId())))
                    .collect(Collectors.toList());

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
    public ResponseEntity<Void> rejectEvent(@PathVariable Long id,
                                            @RequestBody(required = false) Map<String, String> body) {
        String reason = (body != null) ? body.get("reason") : null;
        eventService.rejectEvent(id, reason);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/events/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok().build();
    }
}
