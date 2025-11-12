package it.unical.service;

import it.unical.repository.EventRepository;
import it.unical.model.Event;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    // ✅ Crea un nuovo evento
    public Event createEvent(Event event) {
        event.setCreatedAt(LocalDateTime.now());
        return eventRepository.save(event);
    }

    // ✅ Restituisce tutti gli eventi
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
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
