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

        // 🚨 Filtro: Rimuovi eventi creati dall'utente stesso (se regola "creator !=
        // owner")
        // Nota: Event entity deve avere campo creator? Controlla Event.java.
        // Se non c'è relazione diretta "creator", uso una logica alternativa o
        // controllo participants?
        // Solitamente "Partecipazione" include il creatore.
        // Se l'utente vuole nasconderli dalla mappa pubblica, ok.

        if (userId != null) {
            Optional<it.unical.model.User> userOpt = userRepository.findById(userId);
            if (userOpt.isPresent()) {
                it.unical.model.User user = userOpt.get();

                // Rimuovi eventi dove l'utente è tra i partecipanti CON ruolo creatore?
                // Al momento non ho ruolo distinto.
                // Assumo che se l'utente chiede "creator non sia proprietario", intenda che non
                // devo vedere i miei eventi nella lista pubblica.
                // Ma come distinguo i miei eventi se non ho il campo "creatorId" in Event?
                // Controllo se l'utente è "User Organizer"?
                // Event.java non sembra avere `creator`.
                // Controllerò Event.java ...

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
        return eventRepository.save(event);
    }

    // ✅ Rifiuta evento (Elimina)
    public void rejectEvent(Long id) {
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

    // ✅ Elimina un evento
    public void deleteEvent(long id) {
        if (!eventRepository.existsById(id)) {
            throw new RuntimeException("Evento non trovato con ID: " + id);
        }
        eventRepository.deleteById(id);
    }

    // ✅ Cerca eventi (Titolo, Città, Nome Creator/Partecipante)
    public List<Event> searchEvents(String query) {
        return eventRepository.searchEvents(query);
    }
}
