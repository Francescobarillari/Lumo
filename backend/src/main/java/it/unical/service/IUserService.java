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

    void followUser(Long followerId, Long followedId);

    void unfollowUser(Long followerId, Long followedId);

    boolean isFollowing(Long followerId, Long followedId);

    List<User> getFollowers(Long userId);

    List<User> getFollowing(Long userId);

    User updateUser(Long userId, String name, String email, String description);

    void changePassword(Long userId, String oldPassword, String newPassword);
}
