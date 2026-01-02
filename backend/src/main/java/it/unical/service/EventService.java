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

@Service("realEventService")
@Transactional
public class EventService implements IEventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private INotificationService notificationService;

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
                        event.setParticipationStatus("ACCEPTED");
                    } else if (user.getPendingEvents().stream().anyMatch(e -> e.getId().equals(event.getId()))) {
                        event.setParticipationStatus("PENDING");
                    } else {
                        event.setParticipationStatus("NONE");
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
                // Must iterate a copy or use iterator to avoid concurrent modification if
                // modifying collection
                // Actually here we modify User side, which cascades? No.
                for (it.unical.model.User user : event.getParticipants()) {
                    user.getParticipatingEvents().remove(event);
                    userRepository.save(user); // Update user side
                }
                event.getParticipants().clear();
            }

            // Remove event from pending participants
            if (event.getPendingParticipants() != null) {
                for (it.unical.model.User user : event.getPendingParticipants()) {
                    user.getPendingEvents().remove(event);
                    userRepository.save(user);
                }
                event.getPendingParticipants().clear();
            }

            // Remove event from all saved users (if needed) - Assuming similar relationship
            // for favorites/saved
            // if (event.getSavedEvents() != null) {
            // Logic removed as getSavedEvents() is not mapped in Event
            // }

            eventRepository.deleteById(id);
        } else {
            throw new RuntimeException("Evento non trovato con ID: " + id);
        }
    }

    // ✅ Cerca eventi
    public List<Event> searchEvents(String query) {
        return eventRepository.searchEvents(query);
    }

    // --- Participation Flow ---

    public void requestParticipation(Long userId, Long eventId) {
        Event event = eventRepository.findById(eventId).orElseThrow(() -> new RuntimeException("Event not found"));
        it.unical.model.User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!event.getParticipants().contains(user) && !event.getPendingParticipants().contains(user)) {
            user.getPendingEvents().add(event);
            userRepository.save(user);

            // Notify Creator
            it.unical.model.User creator = event.getCreator(); // Use the newly added Creator field logic
            if (creator != null && !creator.getId().equals(userId)) { // Don't notify self
                notificationService.createRichNotification(creator.getId(),
                        "Richiesta Partecipazione",
                        user.getName() + " vuole partecipare al tuo evento '" + event.getTitle() + "'",
                        "PARTICIPATION_REQUEST",
                        eventId,
                        userId);
            }
        }
    }

    public void acceptParticipation(Long requesterId, Long eventId) {
        System.out.println("Accepting participation: userId=" + requesterId + ", eventId=" + eventId);
        Event event = eventRepository.findById(eventId).orElseThrow(() -> new RuntimeException("Event not found"));
        it.unical.model.User requester = userRepository.findById(requesterId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (requester.getPendingEvents().contains(event)) {
            System.out.println("User found in pending list. Proceeding...");
            requester.getPendingEvents().remove(event);
            requester.getParticipatingEvents().add(event);
            userRepository.save(requester);

            notificationService.createRichNotification(requesterId,
                    "Richiesta Accettata! 🎉",
                    "Sei stato accettato nell'evento '" + event.getTitle() + "'!",
                    "PARTICIPATION_ACCEPTED",
                    eventId,
                    null);
            System.out.println("Participation accepted and saved.");
        } else {
            System.out.println("ERROR: User NOT found in pending list for this event. Current pending events IDs: ");
            requester.getPendingEvents().forEach(e -> System.out.println(e.getId()));

            // Fallback: If not in pending but trying to accept, maybe assume valid?
            // Or maybe it was already accepted?
            if (requester.getParticipatingEvents().contains(event)) {
                System.out.println("User is already participating.");
            }
        }
    }

    public void rejectParticipation(Long requesterId, Long eventId) {
        Event event = eventRepository.findById(eventId).orElseThrow(() -> new RuntimeException("Event not found"));
        it.unical.model.User requester = userRepository.findById(requesterId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (requester.getPendingEvents().contains(event)) {
            requester.getPendingEvents().remove(event);
            userRepository.save(requester);

            notificationService.createRichNotification(requesterId,
                    "Richiesta Rifiutata",
                    "La tua richiesta per '" + event.getTitle() + "' è stata rifiutata.",
                    "PARTICIPATION_REJECTED",
                    eventId,
                    null);
        }
    }
}
