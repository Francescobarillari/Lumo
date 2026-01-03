package it.unical.service;

import it.unical.model.User;
import it.unical.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("realUserService")
public class UserService implements IUserService {
    // hei hei
    private final UserRepository userRepository;

    private final it.unical.repository.EventRepository eventRepository;

    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, it.unical.repository.EventRepository eventRepository,
            org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public User registerUser(User user) {
        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        return userRepository.save(user);
    }

    @Override
    public List<User> searchUsers(String query) {
        return userRepository.findByNameContainingIgnoreCase(query);
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    // ✅ Aggiunge o Rimuove un evento dai preferiti (Saved Events)
    @Override
    public boolean toggleSavedEvent(Long userId, Long eventId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utente non trovato con ID: " + userId));

        it.unical.model.Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Evento non trovato con ID: " + eventId));

        // Verifica se l'evento è già nei salvati
        boolean isAlreadySaved = user.getSavedEvents().stream().anyMatch(e -> e.getId().equals(eventId));

        if (isAlreadySaved) {
            user.getSavedEvents().removeIf(e -> e.getId().equals(eventId));
            userRepository.save(user);
            return false;
        } else {
            user.getSavedEvents().add(event);
            userRepository.save(user);
            return true;
        }
    }

    @Override
    public String updateProfileImage(Long userId, byte[] imageData) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setProfileImageData(imageData);
        String fileUrl = "http://localhost:8080/api/users/" + userId + "/image";
        user.setProfileImage(fileUrl);
        userRepository.save(user);
        return fileUrl;
    }

    @Override
    public byte[] getProfileImage(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return user.getProfileImageData();
    }

    @Override
    public void followUser(Long followerId, Long followedId) {
        if (followerId.equals(followedId)) {
            throw new RuntimeException("Non puoi seguire te stesso.");
        }

        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new RuntimeException("Follower not found"));
        User followed = userRepository.findById(followedId)
                .orElseThrow(() -> new RuntimeException("User to follow not found"));

        follower.getFollowing().add(followed);
        userRepository.save(follower);
    }

    @Override
    public void unfollowUser(Long followerId, Long followedId) {
        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new RuntimeException("Follower not found"));
        User followed = userRepository.findById(followedId)
                .orElseThrow(() -> new RuntimeException("User to unfollow not found"));

        if (follower.getFollowing().contains(followed)) {
            follower.getFollowing().remove(followed);
            userRepository.save(follower);
        }
    }

    @Override
    public boolean isFollowing(Long followerId, Long followedId) {
        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new RuntimeException("Follower not found"));
        User followed = userRepository.findById(followedId)
                .orElseThrow(() -> new RuntimeException("User to check not found"));

        return follower.getFollowing().contains(followed);
    }

    @Override
    public List<User> getFollowers(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return new java.util.ArrayList<>(user.getFollowers());
    }

    @Override
    public List<User> getFollowing(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return new java.util.ArrayList<>(user.getFollowing());
    }

    @Override
    public User updateUser(Long userId, String name, String email) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (name != null && !name.trim().isEmpty()) {
            user.setName(name);
        }
        if (email != null && !email.trim().isEmpty()) {
            // Check if email already exists if different? Assuming simple update for now.
            // In a real app we might want to check unique constraint or handle exception
            // from DB.
            user.setEmail(email);
        }
        return userRepository.save(user);
    }

    @Override
    public void changePassword(Long userId, String oldPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(oldPassword, user.getPasswordHash())) {
            throw new RuntimeException("Incorrect old password");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
