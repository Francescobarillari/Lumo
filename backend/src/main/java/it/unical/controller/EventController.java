package it.unical.controller;

import it.unical.model.Event;
import it.unical.service.IEventService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:4200")
public class EventController {
    private final IEventService eventService;

    public EventController(IEventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public List<Event> getAllEvents(@RequestParam(required = false) Long userId) {
        return eventService.getAllEvents(userId);
    }

    @GetMapping("/search")
    public List<Event> searchEvents(@RequestParam String q) {
        return eventService.searchEvents(q);
    }

    @GetMapping("/{id}")
    public Optional<Event> getEventById(@PathVariable Long id, @RequestParam(required = false) Long userId) {
        return eventService.getEventById(id, userId);
    }

    @GetMapping("/organized")
    public List<Event> getOrganizedEvents(@RequestParam Long userId) {
        return eventService.getOrganizedEvents(userId);
    }

    @GetMapping("/joined")
    public List<Event> getJoinedEvents(@RequestParam Long userId) {
        return eventService.getJoinedEvents(userId);
    }

    @PostMapping
    public Event createEvent(@RequestBody Event event, @RequestParam(required = false) Long userId) {
        return eventService.createEvent(event, userId);
    }

    @DeleteMapping("/{id}")
    public void deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
    }

    @PostMapping("/{id}/participation-request")
    public ResponseEntity<Void> requestParticipation(@PathVariable Long id, @RequestParam Long userId) {
        eventService.requestParticipation(userId, id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/participants/{userId}/accept")
    public ResponseEntity<Void> acceptParticipation(@PathVariable Long id, @PathVariable Long userId) {
        eventService.acceptParticipation(userId, id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/participants/{userId}/reject")
    public ResponseEntity<Void> rejectParticipation(@PathVariable Long id, @PathVariable Long userId) {
        eventService.rejectParticipation(userId, id);
        return ResponseEntity.ok().build();
    }
}
