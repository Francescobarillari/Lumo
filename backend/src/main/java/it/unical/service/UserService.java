package it.unical.service;

import it.unical.model.User;
import it.unical.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("realUserService")
public class UserService implements IUserService {
    private final UserRepository userRepository;

    private final it.unical.repository.EventRepository eventRepository;

    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    private final INotificationService notificationService;

    public UserService(UserRepository userRepository, it.unical.repository.EventRepository eventRepository,
                       org.springframework.security.crypto.password.PasswordEncoder passwordEncoder,
                       INotificationService notificationService) {
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.passwordEncoder = passwordEncoder;
        this.notificationService = notificationService;
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user != null) {
            user.setApprovedEventsCount(eventRepository.countByCreator_IdAndIsApprovedTrue(id));
        }
        return user;
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

    @Override
    public boolean toggleSavedEvent(Long userId, Long eventId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utente non trovato con ID: " + userId));

        it.unical.model.Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Evento non trovato con ID: " + eventId));

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
    public List<it.unical.model.Event> getSavedEvents(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        List<it.unical.model.Event> events = new java.util.ArrayList<>(user.getSavedEvents());
        for (it.unical.model.Event event : events) {
            if (event.getUsersWhoSaved() != null) {
                event.setSavedCount(event.getUsersWhoSaved().size());
            } else {
                event.setSavedCount(0);
            }
        }
        return events;
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

        if (!follower.getFollowing().contains(followed)) {
            follower.getFollowing().add(followed);
            follower.getFollowNotifications().add(followed);
            userRepository.save(follower);

            notificationService.createRichNotification(followedId,
                    "New Follower",
                    follower.getName() + " started following you!",
                    "NEW_FOLLOWER",
                    null,
                    followerId);
        }
    }

    @Override
    public void unfollowUser(Long followerId, Long followedId) {
        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new RuntimeException("Follower not found"));
        User followed = userRepository.findById(followedId)
                .orElseThrow(() -> new RuntimeException("User to unfollow not found"));

        if (follower.getFollowing().contains(followed)) {
            follower.getFollowing().remove(followed);
            follower.getFollowNotifications().remove(followed);
            userRepository.save(follower);
        }
    }

    @Override
    public boolean isFollowing(Long followerId, Long followedId) {
        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new RuntimeException("Follower not found"));
        User followed = userRepository.findById(followedId)
                .orElseThrow(() -> new RuntimeException("User to check not found"));

        return follower.getFollowing().stream().anyMatch(u -> u.getId().equals(followedId));
    }

    @Override
    public boolean isFollowNotificationsEnabled(Long followerId, Long followedId) {
        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new RuntimeException("Follower not found"));
        User followed = userRepository.findById(followedId)
                .orElseThrow(() -> new RuntimeException("User to check not found"));

        return follower.getFollowNotifications().stream().anyMatch(u -> u.getId().equals(followedId));
    }

    @Override
    public void setFollowNotifications(Long followerId, Long followedId, boolean enabled) {
        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new RuntimeException("Follower not found"));
        User followed = userRepository.findById(followedId)
                .orElseThrow(() -> new RuntimeException("User to check not found"));

        if (!follower.getFollowing().contains(followed)) {
            throw new RuntimeException("Impossibile impostare notifiche per un utente che non segui.");
        }

        if (enabled) {
            follower.getFollowNotifications().add(followed);
        } else {
            follower.getFollowNotifications().remove(followed);
        }
        userRepository.save(follower);
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
    public User updateUser(Long userId, String name, String email, String description) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (name != null && !name.trim().isEmpty()) {
            user.setName(name);
        }
        if (email != null && !email.trim().isEmpty()) {
            user.setEmail(email);
        }
        if (description != null) {
            user.setDescription(description);
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
