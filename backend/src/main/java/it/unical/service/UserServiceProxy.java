package it.unical.service;

import it.unical.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Primary
public class UserServiceProxy implements IUserService {

    private final IUserService realService;

    @Autowired
    public UserServiceProxy(@Qualifier("realUserService") IUserService realService) {
        this.realService = realService;
    }

    @Override
    public List<User> getAllUsers() {
        System.out.println("[UserServiceProxy] Fetching all users.");
        return realService.getAllUsers();
    }

    @Override
    public User getUserById(Long id) {
        // System.out.println("[UserServiceProxy] Fetching user ID: " + id); // Too
        // noisy usually
        return realService.getUserById(id);
    }

    @Override
    public User registerUser(User user) {
        System.out.println("[UserServiceProxy] Registering new user: " + user.getEmail());
        return realService.registerUser(user);
    }

    @Override
    public List<User> searchUsers(String query) {
        return realService.searchUsers(query);
    }

    @Override
    public void deleteUser(Long id) {
        System.out.println("[UserServiceProxy] SECURITY CHECK: Deleting user ID: " + id);
        realService.deleteUser(id);
    }

    @Override
    public boolean toggleSavedEvent(Long userId, Long eventId) {
        System.out.println("[UserServiceProxy] User " + userId + " toggling saved event " + eventId);
        return realService.toggleSavedEvent(userId, eventId);
    }

    @Override
    public String updateProfileImage(Long userId, byte[] imageData) {
        System.out.println("[UserServiceProxy] Updating profile image for user: " + userId + " (Size: "
                + imageData.length + " bytes)");
        return realService.updateProfileImage(userId, imageData);
    }

    @Override
    public byte[] getProfileImage(Long userId) {
        return realService.getProfileImage(userId);
    }

    @Override
    public void followUser(Long followerId, Long followedId) {
        System.out.println("[UserServiceProxy] User " + followerId + " following User " + followedId);
        realService.followUser(followerId, followedId);
    }

    @Override
    public void unfollowUser(Long followerId, Long followedId) {
        System.out.println("[UserServiceProxy] User " + followerId + " unfollowing User " + followedId);
        realService.unfollowUser(followerId, followedId);
    }
}
