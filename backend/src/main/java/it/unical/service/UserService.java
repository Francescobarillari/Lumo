package it.unical.service;

import it.unical.model.User;
import it.unical.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    // hei hei
    private final UserRepository userRepository;

    private final it.unical.repository.EventRepository eventRepository;

    public UserService(UserRepository userRepository, it.unical.repository.EventRepository eventRepository) {
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    // ✅ Aggiunge o Rimuove un evento dai preferiti (Saved Events)
    public boolean toggleSavedEvent(Long userId, Long eventId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utente non trovato con ID: " + userId));

        it.unical.model.Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Evento non trovato con ID: " + eventId));

        // Verifica se l'evento è già nei salvati
        boolean isAlreadySaved = user.getSavedEvents().stream().anyMatch(e -> e.getId().equals(eventId));

        if (isAlreadySaved) {
            // Rimuovi se c'è già (bisogna trovare l'istanza corretta nel set o usare equals
            // su id)
            // Stiamo usando Set<Event>, quindi remove(event) funziona se equals/hashCode
            // sono su ID,
            // ma per sicurezza rimuoviamo l'evento con lo stesso ID dal set.
            user.getSavedEvents().removeIf(e -> e.getId().equals(eventId));
            userRepository.save(user);
            return false;
        } else {
            // Aggiungi se non c'è
            user.getSavedEvents().add(event);
            userRepository.save(user);
            return true;
        }
    }
}
