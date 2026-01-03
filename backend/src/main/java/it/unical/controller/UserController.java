package it.unical.controller;

import it.unical.model.User;
import it.unical.repository.UserRepository;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    private final it.unical.service.IUserService userService;

    public UserController(it.unical.service.IUserService userService) {
        this.userService = userService;
    }

    @PostMapping("/{id}/image")
    @Transactional
    public ResponseEntity<Map<String, String>> uploadProfileImage(@PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        try {
            byte[] resizedImage = it.unical.utils.ImageUtility.resizeImage(file.getBytes(), 128, 128);
            String fileUrl = userService.updateProfileImage(id, resizedImage);

            Map<String, String> response = new HashMap<>();
            response.put("imageUrl", fileUrl);
            return ResponseEntity.ok(response);

        } catch (IOException e) {
            throw new RuntimeException("Could not store file", e);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/search")
    public List<User> searchUsers(@RequestParam String q) {
        return userService.searchUsers(q);
    }

    @GetMapping("/{id}/image")
    @Transactional
    public ResponseEntity<byte[]> serveFile(@PathVariable Long id) {
        byte[] imageData = userService.getProfileImage(id);
        if (imageData == null || imageData.length == 0) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(imageData);
    }

    @PostMapping("/{userId}/saved-events/{eventId}")
    public ResponseEntity<Map<String, Boolean>> toggleSavedEvent(
            @PathVariable Long userId,
            @PathVariable Long eventId) {

        boolean isSaved = userService.toggleSavedEvent(userId, eventId);

        Map<String, Boolean> response = new HashMap<>();
        response.put("isSaved", isSaved);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{followerId}/follow/{followedId}")
    public ResponseEntity<Void> followUser(
            @PathVariable Long followerId,
            @PathVariable Long followedId) {
        userService.followUser(followerId, followedId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{followerId}/follow/{followedId}")
    public ResponseEntity<Void> unfollowUser(
            @PathVariable Long followerId,
            @PathVariable Long followedId) {
        userService.unfollowUser(followerId, followedId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{followerId}/is-following/{followedId}")
    public ResponseEntity<Map<String, Boolean>> isFollowing(
            @PathVariable Long followerId,
            @PathVariable Long followedId) {
        boolean isFollowing = userService.isFollowing(followerId, followedId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("isFollowing", isFollowing);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/followers")
    public ResponseEntity<List<User>> getFollowers(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getFollowers(id));
    }

    @GetMapping("/{id}/following")
    public ResponseEntity<List<User>> getFollowing(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getFollowing(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String name = payload.get("name");
        String email = payload.get("email");
        return ResponseEntity.ok(userService.updateUser(id, name, email));
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<Void> changePassword(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String oldPassword = payload.get("oldPassword");
        String newPassword = payload.get("newPassword");
        try {
            userService.changePassword(id, oldPassword, newPassword);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
