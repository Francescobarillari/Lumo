package it.unical.service;

import it.unical.model.User;
import java.util.List;

public interface IUserService {
    List<User> getAllUsers();

    User getUserById(Long id);

    User registerUser(User user);

    List<User> searchUsers(String query);

    void deleteUser(Long id);

    boolean toggleSavedEvent(Long userId, Long eventId);

    // New methods to replace Controller logic
    String updateProfileImage(Long userId, byte[] imageData);

    byte[] getProfileImage(Long userId);
}
