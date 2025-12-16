package it.unical.service;

import it.unical.repository.EventRepository;
import it.unical.model.Event;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import it.unical.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    // ✅ Crea un nuovo evento (In attesa di approvazione)
    public Event createEvent(Event event, Long userId) {
        event.setCreatedAt(LocalDateTime.now());
        event.setIsApproved(false); // Default pending
        Event savedEvent = eventRepository.save(event);

        if (userId != null) {
            userRepository.findById(userId).ifPresent(user -> {
                user.getParticipatingEvents().add(savedEvent);
                userRepository.save(user);
            });
        }
        return savedEvent;
    }

    // ✅ Restituisce tutti gli eventi APPROVATI e NON CREATI dall'utente corrente
    public List<Event> getAllEvents(Long userId) {
        List<Event> events = eventRepository.findByIsApprovedTrueOrderByDateAscStartTimeAsc();

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

    // ✅ Restituisce eventi IN ATTESA (Per Admin)
    public List<Event> getPendingEvents() {
        return eventRepository.findByIsApprovedFalseOrderByDateAscStartTimeAsc();
    }

    // ✅ Approva evento
    public Event approveEvent(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evento non trovato con ID: " + id));
        event.setIsApproved(true);
        Event saved = eventRepository.save(event);

        // Notify Creator
        if (event.getParticipants() != null && !event.getParticipants().isEmpty()) {
            it.unical.model.User creator = event.getParticipants().iterator().next();
            notificationService.createNotification(creator.getId(),
                    "Evento Approvato",
                    "Il tuo evento '" + event.getTitle() + "' è stato approvato ed è ora visibile!",
                    "APPROVED");
        }
        return saved;
    }

    // ✅ Rifiuta evento (Elimina) con motivazione opzionale
    public void rejectEvent(Long id, String reason) {
        Optional<Event> eventOpt = eventRepository.findById(id);
        if (eventOpt.isPresent()) {
            Event event = eventOpt.get();
            // Notify Creator BEFORE reject
            if (event.getParticipants() != null && !event.getParticipants().isEmpty()) {
                it.unical.model.User creator = event.getParticipants().iterator().next();

                String message = "Il tuo evento '" + event.getTitle() + "' è stato rifiutato.";
                if (reason != null && !reason.trim().isEmpty()) {
                    message += " Motivazione: " + reason;
                }

                notificationService.createNotification(creator.getId(),
                        "Evento Rifiutato",
                        message,
                        "REJECTED");
            }
        }
        deleteEvent(id);
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

    // ✅ Elimina un evento (Risolve FK Constraint)
    public void deleteEvent(long id) {
        Optional<Event> eventOpt = eventRepository.findById(id);
        if (eventOpt.isPresent()) {
            Event event = eventOpt.get();

            // Remove event from all participants
            if (event.getParticipants() != null) {
                for (it.unical.model.User user : event.getParticipants()) {
                    user.getParticipatingEvents().remove(event);
                    userRepository.save(user); // Update user side
                }
                event.getParticipants().clear();
            }

            // Remove event from all saved users (if needed)
            // Assuming similar relationship for favorites/saved

            eventRepository.deleteById(id);
        } else {
            throw new RuntimeException("Evento non trovato con ID: " + id);
        }
    }

    // ✅ Cerca eventi
    public List<Event> searchEvents(String query) {
        return eventRepository.searchEvents(query);
    }
}
