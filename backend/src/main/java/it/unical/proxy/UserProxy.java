package it.unical.proxy;

import it.unical.model.Event;
import it.unical.model.User;

import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;

public class UserProxy extends User {
    public UserProxy() {
    }

    public UserProxy(javax.sql.DataSource ignored) {
        // Kept for backward compatibility with existing constructors in DAOs/proxies.
    }

    @Override
    public void setParticipatingEvents(Set<Event> participatingEvents) {
        Set<Event> participating = sanitizeEvents(participatingEvents);
        super.setParticipatingEvents(participating);
        super.setPendingEvents(removeOverlaps(sanitizeEvents(super.getPendingEvents()), participating));
    }

    @Override
    public void setPendingEvents(Set<Event> pendingEvents) {
        Set<Event> pending = sanitizeEvents(pendingEvents);
        Set<Event> participating = sanitizeEvents(super.getParticipatingEvents());
        super.setPendingEvents(removeOverlaps(pending, participating));
    }

    @Override
    public void setSavedEvents(Set<Event> savedEvents) {
        super.setSavedEvents(sanitizeEvents(savedEvents));
    }

    @Override
    public void setFollowing(Set<User> following) {
        Set<User> sanitizedFollowing = sanitizeUsers(following);
        super.setFollowing(sanitizedFollowing);
        super.setFollowNotifications(keepSubset(sanitizeUsers(super.getFollowNotifications()), sanitizedFollowing));
    }

    @Override
    public void setFollowers(Set<User> followers) {
        super.setFollowers(sanitizeUsers(followers));
    }

    @Override
    public void setFollowNotifications(Set<User> followNotifications) {
        Set<User> following = sanitizeUsers(super.getFollowing());
        super.setFollowNotifications(keepSubset(sanitizeUsers(followNotifications), following));
    }

    private Set<Event> sanitizeEvents(Set<Event> events) {
        Map<Long, Event> byId = new LinkedHashMap<>();
        if (events == null) {
            return new LinkedHashSet<>();
        }
        for (Event event : events) {
            if (event == null || event.getId() == null) {
                continue;
            }
            byId.putIfAbsent(event.getId(), event);
        }
        return new LinkedHashSet<>(byId.values());
    }

    private Set<User> sanitizeUsers(Set<User> users) {
        Map<Long, User> byId = new LinkedHashMap<>();
        if (users == null) {
            return new LinkedHashSet<>();
        }
        for (User user : users) {
            if (user == null || user.getId() == null) {
                continue;
            }
            if (getId() != null && getId().equals(user.getId())) {
                continue;
            }
            byId.putIfAbsent(user.getId(), user);
        }
        return new LinkedHashSet<>(byId.values());
    }

    private Set<Event> removeOverlaps(Set<Event> source, Set<Event> forbidden) {
        Set<Event> result = new LinkedHashSet<>(source);
        result.removeIf(event -> forbidden.stream().anyMatch(e -> e.getId().equals(event.getId())));
        return result;
    }

    private Set<User> keepSubset(Set<User> source, Set<User> allowed) {
        Set<User> result = new LinkedHashSet<>(source);
        result.removeIf(user -> allowed.stream().noneMatch(a -> a.getId().equals(user.getId())));
        return result;
    }
}
