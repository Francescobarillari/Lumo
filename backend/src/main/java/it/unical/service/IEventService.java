package it.unical.service;

import it.unical.model.Event;
import java.util.List;
import java.util.Optional;

public interface IEventService {
    Event createEvent(Event event, Long userId);

    List<Event> getAllEvents(Long userId);

    List<Event> getOrganizedEvents(Long userId);

    List<Event> getJoinedEvents(Long userId);

    List<Event> getPendingEvents();

    List<Event> getAllEventsForAdmin();

    Event approveEvent(Long id);

    void rejectEvent(Long id, String reason);

    Optional<Event> getEventById(Long id, Long userId);

    Event updateEvent(Long id, Event updatedEvent);

    void deleteEvent(long id);

    List<Event> searchEvents(String query);

    void requestParticipation(Long userId, Long eventId);

    void acceptParticipation(Long requesterId, Long eventId);

    void rejectParticipation(Long requesterId, Long eventId);
}
