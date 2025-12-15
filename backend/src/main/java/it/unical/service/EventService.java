package it.unical.service;

import it.unical.repository.EventRepository;
import it.unical.model.Event;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private it.unical.repository.UserRepository userRepository;

    // ✅ Crea un nuovo evento
    public Event createEvent(Event event) {
        event.setCreatedAt(LocalDateTime.now());
        return eventRepository.save(event);
    }

    // ✅ Restituisce tutti gli eventi (con status per userId opzionale)
    public List<Event> getAllEvents(Long userId) {
        List<Event> events = eventRepository.findAllByOrderByDateAscStartTimeAsc();

        if (userId != null) {
            Optional<it.unical.model.User> userOpt = userRepository.findById(userId);
            if (userOpt.isPresent()) {
                it.unical.model.User user = userOpt.get();
                for (Event event : events) {
                    if (user.getParticipatingEvents().stream().anyMatch(e -> e.getId().equals(event.getId()))) {
                        event.setIsParticipating(true);
                    }
                    if (user.getSavedEvents().stream().anyMatch(e -> e.getId().equals(event.getId()))) {
                        event.setIsSaved(true);
                    }
                }
            }
        }

        return events;
    }

    // ✅ Trova un evento per ID
    public Optional<Event> getEventById(Long id) {
        return eventRepository.findById(id);
    }

    // ✅ Aggiorna un evento
    public Event updateEvent(Long id, Event updatedEvent) {
        return eventRepository.findById(id).map(event -> {
            event.setTitle(updatedEvent.getTitle());
            event.setDescription(updatedEvent.getDescription());
            event.setnPartecipants(updatedEvent.getnPartecipants());
            event.setCity(updatedEvent.getCity());
            event.setDate(updatedEvent.getDate());
            event.setStartTime(updatedEvent.getStartTime());
            event.setEndTime(updatedEvent.getEndTime());
            return eventRepository.save(event);
        }).orElseThrow(() -> new RuntimeException("Evento non trovato con ID: " + id));
    }

    // ✅ Elimina un evento
    public void deleteEvent(long id) {
        if (!eventRepository.existsById(id)) {
            throw new RuntimeException("Evento non trovato con ID: " + id);
        }
        eventRepository.deleteById(id);
    }
}
