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
        if (event.getCostPerPerson() != null && event.getCostPerPerson() < 0) {
            event.setCostPerPerson(0.0);
        }
        Event savedEvent = eventRepository.save(event);

        if (userId != null) {
            userRepository.findById(userId).ifPresent(user -> {
                event.setCreator(user); // Fix: Set creator explicitly
                // Determine if we should add to participating?
                // Usually creator is automatically participating?
                // Let's assume creator IS participating.
                user.getParticipatingEvents().add(savedEvent); // Keep this for consistency with participants logic
                userRepository.save(user);

                // IMPORTANT: Set relationship in Event side if bidirectional logical link
                // needed immediately
                // But JPA handles it via User side owning the relationship (mappedBy in Event)

                // Notify followers who enabled notifications for this creator
                notifyFollowersAboutEvent(user,
                        savedEvent,
                        "New event",
                        user.getName() + " published a new event: '" + savedEvent.getTitle() + "'.",
                        "NEW_EVENT");
            });
            // Save again to persist creator FK
            return eventRepository.save(event);
        }
        return savedEvent;
    }

    @Override
    public List<Event> getOrganizedEvents(Long userId) {
        List<Event> events = eventRepository.findByCreator_Id(userId);

        // Populate transient pendingUsersList from persistent pendingParticipants for
        // UI
        for (Event event : events) {
            if (event.getPendingParticipants() != null) {
                event.setPendingUsersList(new java.util.ArrayList<>(event.getPendingParticipants()));
            }
            if (event.getPendingParticipants() != null) {
                event.setPendingUsersList(new java.util.ArrayList<>(event.getPendingParticipants()));
            }
            processEventParticipants(event);
        }
        return events;
    }

    @Override
    public List<Event> getJoinedEvents(Long userId) {
        return userRepository.findById(userId)
                .map(user -> user.getParticipatingEvents().stream()
                        .filter(e -> e.getCreator() == null || !e.getCreator().getId().equals(userId))
                        .collect(java.util.stream.Collectors.toList()))
                .orElse(new java.util.ArrayList<>());
    }

    // ✅ Restituisce tutti gli eventi APPROVATI e NON CREATI dall'utente corrente
    public List<Event> getAllEvents(Long userId) {
        List<Event> events = eventRepository.findByIsApprovedTrueOrderByDateAscStartTimeAsc();

        if (userId != null) {
            Optional<it.unical.model.User> userOpt = userRepository.findById(userId);
            if (userOpt.isPresent()) {
                it.unical.model.User user = userOpt.get();
                for (Event event : events) {
                    processEventParticipants(event); // Centralized logic

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
        } else {
            // Even if no user logged in, we want occupied spots
            for (Event event : events) {
                processEventParticipants(event);
            }
        }
        return events;
    }

    // Helper method to process participants (exclude creator + sort)
    private void processEventParticipants(Event event) {
        if (event.getParticipants() != null) {
            Long creatorId = event.getCreatorId();
            List<it.unical.model.User> realParticipants = new java.util.ArrayList<>();

            for (it.unical.model.User p : event.getParticipants()) {
                if (creatorId == null || !p.getId().equals(creatorId)) {
                    realParticipants.add(p);
                }
            }

            event.setOccupiedSpots(realParticipants.size());
            event.setAcceptedUsersList(realParticipants);
            // Sort by name for consistency
            event.getAcceptedUsersList().sort((u1, u2) -> u1.getName().compareToIgnoreCase(u2.getName()));
        } else {
            event.setOccupiedSpots(0);
            event.setAcceptedUsersList(new java.util.ArrayList<>());
        }
    }

    // ✅ Restituisce eventi IN ATTESA (Per Admin)
    public List<Event> getPendingEvents() {
        return eventRepository.findByIsApprovedFalseOrderByDateAscStartTimeAsc();
    }

    @Override
    public List<Event> getAllEventsForAdmin() {
        return eventRepository.findAllByOrderByDateAscStartTimeAsc();
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
                    "Event Approved",
                    "Your event '" + event.getTitle() + "' has been approved and is now visible!",
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

                String message = "Your event '" + event.getTitle() + "' has been rejected.";
                if (reason != null && !reason.trim().isEmpty()) {
                    message += " Reason: " + reason;
                }

                notificationService.createNotification(creator.getId(),
                        "Event Rejected",
                        message,
                        "REJECTED");
            }
        }
        deleteEvent(id);
    }

    // ✅ Trova un evento per ID
    // ✅ Trova un evento per ID (con contesto utente)
    public Optional<Event> getEventById(Long id, Long userId) {
        return eventRepository.findById(id).map(event -> {
            processEventParticipants(event);

            if (userId != null) {
                userRepository.findById(userId).ifPresent(user -> {
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
                });
            }

            return event;
        });
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
            if (updatedEvent.getCostPerPerson() != null && updatedEvent.getCostPerPerson() < 0) {
                event.setCostPerPerson(0.0);
            } else {
                event.setCostPerPerson(updatedEvent.getCostPerPerson());
            }
            return eventRepository.save(event);
        }).orElseThrow(() -> new RuntimeException("Evento non trovato con ID: " + id));
    }

    // ✅ Elimina un evento (Risolve FK Constraint)
    public void deleteEvent(long id) {
        Optional<Event> eventOpt = eventRepository.findById(id);
        if (eventOpt.isPresent()) {
            Event event = eventOpt.get();
            it.unical.model.User creator = event.getCreator();

            // Notify Creator
            if (creator != null) {
                notificationService.createNotification(creator.getId(),
                        "Event Deleted",
                        "Your event '" + event.getTitle() + "' has been deleted successfully.",
                        "EVENT_CANCELLED");
            }

            // Notify Participants
            if (event.getParticipants() != null) {
                for (it.unical.model.User participant : event.getParticipants()) {
                    // Avoid notifying creator again if they are in participants list (logic depends
                    // on model)
                    if (creator == null || !participant.getId().equals(creator.getId())) {
                        notificationService.createNotification(participant.getId(),
                                "Event Cancelled",
                                "The event '" + event.getTitle() + "' you were participating in has been cancelled.",
                                "EVENT_CANCELLED");
                    }
                }
            }

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

            // Remove event from all saved users
            if (event.getUsersWhoSaved() != null) {
                // Iterate copy to avoid ConcurrentModificationException
                for (it.unical.model.User user : new java.util.ArrayList<>(event.getUsersWhoSaved())) {
                    user.getSavedEvents().remove(event);
                    userRepository.save(user);
                }
                event.getUsersWhoSaved().clear();
            }

            // Notify followers who enabled notifications for this creator
            if (creator != null) {
                notifyFollowersAboutEvent(creator,
                        event,
                        "Event cancelled",
                        creator.getName() + " cancelled the event '" + event.getTitle() + "'.",
                        "EVENT_CANCELLED_FOLLOWED");
            }

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
            Long creatorId = event.getCreatorId(); // Use smart getter with fallback
            if (creatorId != null && !creatorId.equals(userId)) { // Don't notify self
                notificationService.createRichNotification(creatorId,
                        "Participation Request",
                        user.getName() + " wants to participate in your event '" + event.getTitle() + "'",
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
        Long creatorId = event.getCreatorId();

        if (requester.getPendingEvents().contains(event)) {
            System.out.println("User found in pending list. Proceeding...");
            requester.getPendingEvents().remove(event);
            requester.getParticipatingEvents().add(event);
            userRepository.save(requester);

            notificationService.createRichNotification(requesterId,
                    "Request Accepted! \uD83C\uDF89",
                    "You have been accepted in the event '" + event.getTitle() + "'!",
                    "PARTICIPATION_ACCEPTED",
                    eventId,
                    null);
            if (creatorId != null) {
                notificationService.clearParticipationRequestNotification(creatorId, eventId, requesterId);
            }
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
        Long creatorId = event.getCreatorId();

        if (requester.getPendingEvents().contains(event)) {
            requester.getPendingEvents().remove(event);
            userRepository.save(requester);

            notificationService.createRichNotification(requesterId,
                    "Request Rejected",
                    "Your request for '" + event.getTitle() + "' has been rejected.",
                    "PARTICIPATION_REJECTED",
                    eventId,
                    null);
            if (creatorId != null) {
                notificationService.clearParticipationRequestNotification(creatorId, eventId, requesterId);
            }
        }
    }

    public void leaveEvent(Long userId, Long eventId) {
        Event event = eventRepository.findById(eventId).orElseThrow(() -> new RuntimeException("Event not found"));
        it.unical.model.User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean removed = user.getParticipatingEvents().remove(event);
        // Clean up any stale pending link as well
        user.getPendingEvents().remove(event);
        userRepository.save(user);

        if (removed && event.getParticipants() != null) {
            event.getParticipants().remove(user);
        }
        if (event.getPendingParticipants() != null) {
            event.getPendingParticipants().remove(user);
        }
    }

    private void notifyFollowersAboutEvent(it.unical.model.User creator, Event event, String title, String message,
            String type) {
        if (creator.getFollowers() == null || creator.getFollowers().isEmpty())
            return;

        creator.getFollowers().forEach(follower -> {
            if (follower.getFollowNotifications().contains(creator)) {
                notificationService.createRichNotification(
                        follower.getId(),
                        title,
                        message,
                        type,
                        event.getId(),
                        creator.getId());
            }
        });
    }
}
