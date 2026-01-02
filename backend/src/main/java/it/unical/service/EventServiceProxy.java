package it.unical.service;

import it.unical.model.Event;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Primary // Takes precedence for injection
public class EventServiceProxy implements IEventService {

    private final IEventService realService;

    @Autowired
    public EventServiceProxy(@Qualifier("realEventService") IEventService realService) {
        this.realService = realService;
    }

    @Override
    public Event createEvent(Event event, Long userId) {
        System.out.println("[Proxy] Creating event: " + event.getTitle());
        return realService.createEvent(event, userId);
    }

    @Override
    public List<Event> getAllEvents(Long userId) {
        System.out.println("[Proxy] Fetching all events for user: " + userId);
        return realService.getAllEvents(userId);
    }

    @Override
    public List<Event> getPendingEvents() {
        System.out.println("[Proxy] Fetching pending events.");
        return realService.getPendingEvents();
    }

    @Override
    public List<Event> getOrganizedEvents(Long userId) {
        System.out.println("[Proxy] Fetching organized events for user: " + userId);
        return realService.getOrganizedEvents(userId);
    }

    @Override
    public List<Event> getJoinedEvents(Long userId) {
        System.out.println("[Proxy] Fetching joined events for user: " + userId);
        return realService.getJoinedEvents(userId);
    }

    @Override
    public Event approveEvent(Long id) {
        System.out.println("[Proxy] Approving event ID: " + id);
        return realService.approveEvent(id);
    }

    @Override
    public void rejectEvent(Long id, String reason) {
        System.out.println("[Proxy] Rejecting event ID: " + id + " Reason: " + reason);
        realService.rejectEvent(id, reason);
    }

    @Override
    public Optional<Event> getEventById(Long id) {
        return realService.getEventById(id);
    }

    @Override
    public Event updateEvent(Long id, Event updatedEvent) {
        System.out.println("[Proxy] Updating event ID: " + id);
        return realService.updateEvent(id, updatedEvent);
    }

    @Override
    public void deleteEvent(long id) {
        System.out.println("[Proxy] SECURITY CHECK: Deleting event ID: " + id);
        // Here we could add logic like checking if user is admin, etc.
        // For now, we log and proceed.
        realService.deleteEvent(id);
    }

    @Override
    public List<Event> searchEvents(String query) {
        return realService.searchEvents(query);
    }

    @Override
    public void requestParticipation(Long userId, Long eventId) {
        System.out.println("[Proxy] User " + userId + " requesting participation in event " + eventId);
        realService.requestParticipation(userId, eventId);
    }

    @Override
    public void acceptParticipation(Long requesterId, Long eventId) {
        System.out.println("[Proxy] Accepting participation for User " + requesterId + " in Event " + eventId);
        realService.acceptParticipation(requesterId, eventId);
    }

    @Override
    public void rejectParticipation(Long requesterId, Long eventId) {
        System.out.println("[Proxy] Rejecting participation for User " + requesterId + " in Event " + eventId);
        realService.rejectParticipation(requesterId, eventId);
    }
}
