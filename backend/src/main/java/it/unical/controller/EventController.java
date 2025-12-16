package it.unical.controller;

import it.unical.model.Event;
import it.unical.service.EventService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:4200")
public class EventController {
    private final EventService eventService;

    public EventController(EventService eventService) {
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
    public Optional<Event> getEventById(@PathVariable Long id) {
        return eventService.getEventById(id);
    }

    @PostMapping
    public Event createEvent(@RequestBody Event event, @RequestParam(required = false) Long userId) {
        return eventService.createEvent(event, userId);
    }

    @DeleteMapping("/{id}")
    public void deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
    }
}
